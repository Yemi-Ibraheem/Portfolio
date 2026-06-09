import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Save, LogOut, Key, GripVertical } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { API_BASE, fallbackProjectList, inferMediaType, normaliseProjects, resolveMediaUrl } from '../lib/projects';

const emptyProject = () => ({
  title: '',
  role: '',
  year: new Date().getFullYear().toString(),
  teamSize: '',
  description: '',
  detailIntro: '',
  imageUrl: '',
  behanceLink: '',
  industry: '',
  tags: [],
  media: [],
  detailSections: [
    { title: 'Context', copy: [] },
    { title: 'Approach', copy: [] },
    { title: 'Outcome', copy: [] },
  ],
});

const productSectionTitles = ['Context', 'Approach', 'Outcome'];

const normaliseEditableSections = (sections = []) =>
  productSectionTitles.map((title, index) => {
    const section = sections[index] || {};
    return {
      title: section.title || title,
      copy: Array.isArray(section.copy) ? section.copy : [],
    };
  });

const createMediaItem = ({ url, caption = '', alt = '', type }) => ({
  id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  url: resolveMediaUrl(url),
  caption,
  alt,
  type: type || inferMediaType(url),
});

const validateImageUrl = (url) =>
  new Promise((resolve, reject) => {
    const imageUrl = resolveMediaUrl(url.trim());

    if (!imageUrl) {
      resolve('');
      return;
    }

    const image = new Image();
    image.onload = () => resolve(imageUrl);
    image.onerror = () => reject(new Error('Image could not be loaded'));
    image.src = imageUrl;
  });

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState(fallbackProjectList);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(emptyProject());
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaCaptionInput, setMediaCaptionInput] = useState('');

  const sortedProjects = useMemo(() => projects, [projects]);

  const showStatus = useCallback((message) => {
    setStatusMessage(message);
    setErrorMessage('');
    setTimeout(() => setStatusMessage(''), 3000);
  }, []);

  const showError = useCallback((message) => {
    setErrorMessage(message);
    setStatusMessage('');
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/projects`);
      const data = await response.json();
      setProjects(normaliseProjects(data));
    } catch (error) {
      console.error('Fetch projects failed', error);
    }
  }, []);

  const checkAuth = useCallback(async (pwd) => {
    try {
      const response = await fetch(`${API_BASE}/auth`, {
        headers: { 'x-admin-password': pwd },
      });

      if (!response.ok) throw new Error('Invalid password');

      setIsAuthenticated(true);
      localStorage.setItem('adminPassword', pwd);
      await fetchProjects();
    } catch {
      setIsAuthenticated(false);
      localStorage.removeItem('adminPassword');
      showError('That password did not work. Check ADMIN_PASSWORD in .env.local.');
    }
  }, [fetchProjects, showError]);

  useEffect(() => {
    const savedPassword = localStorage.getItem('adminPassword');
    if (savedPassword) {
      setPassword(savedPassword);
      checkAuth(savedPassword);
    } else {
      fetchProjects();
    }
  }, [checkAuth, fetchProjects]);

  const handleLogin = (event) => {
    event.preventDefault();
    checkAuth(password);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('adminPassword');
  };

  const persistProjects = async (updatedProjects, successMessage) => {
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify(updatedProjects),
    });

    if (!response.ok) {
      throw new Error('Save failed');
    }

    setProjects(updatedProjects);
    showStatus(successMessage);
  };

  const handleSaveProject = async (event) => {
    event.preventDefault();
    setLoading(true);

    const normalisedCurrent = {
      ...currentProject,
      id: currentProject.id || (Math.max(0, ...projects.map((project) => Number(project.id) || 0)) + 1).toString(),
      tags: currentProject.tags.filter(Boolean),
      detailSections: normaliseEditableSections(currentProject.detailSections)
        .map((section) => ({
          ...section,
          copy: section.copy.map((paragraph) => paragraph.trim()).filter(Boolean),
        }))
        .filter((section) => section.copy.length > 0),
      media: (currentProject.media || [])
        .filter((item) => item.url)
        .map((item, index) => ({
          ...item,
          id: item.id || `media-${index}`,
          type: item.type || inferMediaType(item.url),
        })),
    };

    const updatedProjects = currentProject.id
      ? projects.map((project) => (project.id === currentProject.id ? normalisedCurrent : project))
      : [...projects, normalisedCurrent];

    try {
      normalisedCurrent.imageUrl = await validateImageUrl(normalisedCurrent.imageUrl);
      normalisedCurrent.media = await Promise.all(
        normalisedCurrent.media.map(async (item) => ({
          ...item,
          url: await validateImageUrl(item.url),
        }))
      );
      await persistProjects(updatedProjects, 'Project saved.');
      setIsEditing(false);
      setCurrentProject(emptyProject());
    } catch (error) {
      console.error('Save failed', error);
      showError('Save failed. Check that every hero and gallery image URL opens correctly.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;

    try {
      await persistProjects(projects.filter((project) => project.id !== id), 'Project deleted.');
    } catch (error) {
      console.error('Delete failed', error);
      showError('Delete failed. Confirm your password and try again.');
    }
  };

  const uploadMediaFile = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { 'x-admin-password': password },
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');

    const data = await response.json();
    return data.imageUrl;
  };

  const handleHeroFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const imageUrl = await validateImageUrl(await uploadMediaFile(file));
      setCurrentProject((project) => ({ ...project, imageUrl }));
      showStatus('Hero image uploaded.');
    } catch (error) {
      console.error('Upload failed', error);
      showError('Upload rejected. Choose an image file that can be opened in the browser.');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const handleHeroUrlBlur = async () => {
    const url = currentProject.imageUrl.trim();
    if (!url) return;

    try {
      const imageUrl = await validateImageUrl(url);
      setCurrentProject((project) => ({ ...project, imageUrl }));
    } catch (error) {
      console.error('Hero image URL rejected', error);
      setCurrentProject((project) => ({ ...project, imageUrl: '' }));
      showError('That hero image URL could not be opened. Try a different image type or URL.');
    }
  };


  const handleMediaFileUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      setLoading(true);
      const uploadedItems = [];

      for (const file of files) {
        const url = await validateImageUrl(await uploadMediaFile(file));
        uploadedItems.push(
          createMediaItem({
            url,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            alt: `${currentProject.title || 'Project'} media`,
            type: file.type === 'image/gif' ? 'gif' : inferMediaType(url),
          })
        );
      }

      setCurrentProject((project) => ({
        ...project,
        media: [...(project.media || []), ...uploadedItems],
      }));
      showStatus(`${uploadedItems.length} media ${uploadedItems.length === 1 ? 'item' : 'items'} uploaded.`);
    } catch (error) {
      console.error('Media upload failed', error);
      showError('Media upload rejected. Choose image files that can be opened in the browser.');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const handleAddMediaUrl = async () => {
    const url = mediaUrlInput.trim();
    if (!url) return;

    try {
      const imageUrl = await validateImageUrl(url);
      setCurrentProject((project) => ({
        ...project,
        media: [
          ...(project.media || []),
          createMediaItem({
            url: imageUrl,
            caption: mediaCaptionInput.trim(),
            alt: mediaCaptionInput.trim() || `${project.title || 'Project'} media`,
          }),
        ],
      }));
      setMediaUrlInput('');
      setMediaCaptionInput('');
      showStatus('Gallery image URL added.');
    } catch (error) {
      console.error('Media URL rejected', error);
      showError('That gallery image URL could not be opened. Try a different image type or URL.');
    }
  };

  const updateMediaItem = (id, updates) => {
    setCurrentProject((project) => ({
      ...project,
      media: (project.media || []).map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  };

  const removeMediaItem = (id) => {
    setCurrentProject((project) => ({
      ...project,
      media: (project.media || []).filter((item) => item.id !== id),
    }));
  };

  const moveMediaItem = (id, direction) => {
    setCurrentProject((project) => {
      const media = [...(project.media || [])];
      const index = media.findIndex((item) => item.id === id);
      const targetIndex = index + direction;

      if (index < 0 || targetIndex < 0 || targetIndex >= media.length) {
        return project;
      }

      [media[index], media[targetIndex]] = [media[targetIndex], media[index]];
      return { ...project, media };
    });
  };

  const moveProject = async (id, direction) => {
    const index = projects.findIndex((project) => project.id === id);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updatedProjects = [...projects];
    [updatedProjects[index], updatedProjects[targetIndex]] = [updatedProjects[targetIndex], updatedProjects[index]];

    try {
      await persistProjects(updatedProjects, 'Project order updated.');
    } catch (error) {
      console.error('Reorder failed', error);
      showError('Reorder failed. Try again.');
    }
  };

  const updateDetailSectionCopy = (index, value) => {
    const sections = normaliseEditableSections(currentProject.detailSections);
    sections[index] = {
      ...sections[index],
      copy: value
        .split('\n')
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    };
    setCurrentProject({ ...currentProject, detailSections: sections });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-28">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-[28px] border border-glass-border bg-surface p-8 shadow-[0_24px_90px_rgba(0,0,0,0.12)]"
        >
          <div className="mb-6 grid h-12 w-12 place-items-center rounded-full bg-text text-background">
            <Key size={22} />
          </div>
          <h1 className="text-4xl font-black text-text">CMS login</h1>
          <p className="mt-3 text-text-muted">Manage the work pieces that appear in the portfolio slider and case-study sections.</p>
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <label className="block text-sm font-bold text-text-muted">
              Admin password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-glass-border bg-background px-4 py-3 text-text outline-none focus:border-primary"
                placeholder="Enter password"
                required
              />
            </label>
            {errorMessage && <p className="text-sm font-bold text-red-500">{errorMessage}</p>}
            <button type="submit" className="w-full rounded-full bg-text px-6 py-4 text-sm font-black uppercase text-background">
              Access dashboard
            </button>
          </form>
        </Motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pb-20 pt-28 text-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10 flex flex-col gap-6 border-b border-glass-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-primary">Portfolio CMS</p>
            <h1 className="mt-2 text-5xl font-black leading-none md:text-7xl">Manage work</h1>
            <p className="mt-3 max-w-2xl text-text-muted">Add, edit, upload, delete, and order the portfolio pieces used by the homepage slider.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setCurrentProject(emptyProject());
                setMediaUrlInput('');
                setMediaCaptionInput('');
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-black uppercase text-background"
            >
              <Plus size={18} /> Add work
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-glass-border px-5 py-3 text-sm font-black uppercase text-text"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {(statusMessage || errorMessage) && (
          <div className={`mb-6 rounded-2xl px-4 py-3 text-sm font-bold ${statusMessage ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {statusMessage || errorMessage}
          </div>
        )}

        <div className="grid gap-4">
          {sortedProjects.map((project, index) => (
            <Motion.div
              key={project.id}
              layout
              className="grid gap-4 rounded-[24px] border border-glass-border bg-surface p-4 md:grid-cols-[170px_1fr_auto] md:items-center"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-[18px] bg-background">
                {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover" />}
              </div>
              <div>
                <p className="text-xs font-black uppercase text-text-muted">{project.teamSize || 'Team size'} / {project.role}</p>
                <h2 className="mt-2 text-3xl font-black leading-none">{project.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-glass-border px-3 py-1 text-[11px] font-bold uppercase text-text-muted">
                      {tag}
                    </span>
                  ))}
                  {project.media.length > 0 && (
                    <span className="rounded-full border border-glass-border px-3 py-1 text-[11px] font-bold uppercase text-text-muted">
                      {project.media.length} media
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <button onClick={() => moveProject(project.id, -1)} className="grid h-11 w-11 place-items-center rounded-full border border-glass-border" aria-label="Move up" disabled={index === 0}>
                  <GripVertical size={18} />
                </button>
                <button onClick={() => moveProject(project.id, 1)} className="grid h-11 w-11 place-items-center rounded-full border border-glass-border" aria-label="Move down" disabled={index === projects.length - 1}>
                  <GripVertical size={18} />
                </button>
                <button
                  onClick={() => {
                    setCurrentProject(project);
                    setMediaUrlInput('');
                    setMediaCaptionInput('');
                    setIsEditing(true);
                  }}
                  className="grid h-11 w-11 place-items-center rounded-full bg-text text-background"
                  aria-label="Edit project"
                >
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDeleteProject(project.id)} className="grid h-11 w-11 place-items-center rounded-full bg-red-500 text-white" aria-label="Delete project">
                  <Trash2 size={18} />
                </button>
              </div>
            </Motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-glass-border bg-background"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-glass-border bg-background/90 p-6 backdrop-blur-xl">
                <h2 className="text-3xl font-black">{currentProject.id ? 'Edit work' : 'New work'}</h2>
                <button onClick={() => setIsEditing(false)} className="grid h-10 w-10 place-items-center rounded-full border border-glass-border">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="grid gap-6 p-6 lg:grid-cols-[1fr_0.85fr]">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-text-muted">
                    Project title
                    <input
                      type="text"
                      value={currentProject.title}
                      onChange={(event) => setCurrentProject({ ...currentProject, title: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-glass-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
                      required
                    />
                  </label>
                  <div className="grid gap-4 md:grid-cols-[1.2fr_1fr_0.8fr_0.65fr]">
                    <label className="block text-sm font-bold text-text-muted">
                      Role
                      <input
                        type="text"
                        value={currentProject.role}
                        onChange={(event) => setCurrentProject({ ...currentProject, role: event.target.value })}
                        className="mt-2 w-full rounded-2xl border border-glass-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
                        required
                      />
                    </label>
                    <label className="block text-sm font-bold text-text-muted">
                      Industry
                      <input
                        type="text"
                        value={currentProject.industry}
                        onChange={(event) => setCurrentProject({ ...currentProject, industry: event.target.value })}
                        className="mt-2 w-full rounded-2xl border border-glass-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
                      />
                    </label>
                    <label className="block text-sm font-bold text-text-muted">
                      Team size
                      <input
                        type="text"
                        value={currentProject.teamSize}
                        onChange={(event) => setCurrentProject({ ...currentProject, teamSize: event.target.value })}
                        className="mt-2 w-full rounded-2xl border border-glass-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
                        placeholder="Solo, 4 people, 8-person squad"
                      />
                    </label>
                    <label className="block text-sm font-bold text-text-muted">
                      Year
                      <input
                        type="text"
                        value={currentProject.year}
                        onChange={(event) => setCurrentProject({ ...currentProject, year: event.target.value })}
                        className="mt-2 w-full rounded-2xl border border-glass-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
                        required
                      />
                    </label>
                  </div>
                  <label className="block text-sm font-bold text-text-muted">
                    Case link
                    <input
                      type="url"
                      value={currentProject.behanceLink}
                      onChange={(event) => setCurrentProject({ ...currentProject, behanceLink: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-glass-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
                      placeholder="https://www.behance.net/..."
                    />
                  </label>
                  <label className="block text-sm font-bold text-text-muted">
                    Tags
                    <input
                      type="text"
                      value={currentProject.tags.join(', ')}
                      onChange={(event) => setCurrentProject({ ...currentProject, tags: event.target.value.split(',').map((tag) => tag.trim()) })}
                      className="mt-2 w-full rounded-2xl border border-glass-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
                      placeholder="Web design, UX, Branding"
                    />
                  </label>
                  <label className="block text-sm font-bold text-text-muted">
                    Card description
                    <textarea
                      rows="7"
                      value={currentProject.description}
                      onChange={(event) => setCurrentProject({ ...currentProject, description: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-glass-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
                      required
                    />
                  </label>
                  <div className="rounded-[24px] border border-glass-border bg-surface p-4">
                    <p className="text-sm font-black text-text">Product page descriptions</p>
                    <p className="mt-1 text-xs font-bold text-text-muted">These fields control the case-study detail page. Leave blank to use the automatic fallback copy.</p>
                    <label className="mt-4 block text-sm font-bold text-text-muted">
                      Product page intro
                      <textarea
                        rows="4"
                        value={currentProject.detailIntro}
                        onChange={(event) => setCurrentProject({ ...currentProject, detailIntro: event.target.value })}
                        className="mt-2 w-full rounded-2xl border border-glass-border bg-background px-4 py-3 text-text outline-none focus:border-primary"
                        placeholder="Large intro text at the top of the product page"
                      />
                    </label>
                    <div className="mt-4 grid gap-4">
                      {normaliseEditableSections(currentProject.detailSections).map((section, index) => (
                        <label key={section.title} className="block text-sm font-bold text-text-muted">
                          {section.title}
                          <textarea
                            rows="5"
                            value={section.copy.join('\n')}
                            onChange={(event) => updateDetailSectionCopy(index, event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-glass-border bg-background px-4 py-3 text-text outline-none focus:border-primary"
                            placeholder={`Product page ${section.title.toLowerCase()} copy`}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-bold text-text-muted">Hero image</p>
                    <button
                      type="button"
                      onClick={() => document.getElementById('imageUpload')?.click()}
                      className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-glass-border bg-surface"
                    >
                      {currentProject.imageUrl ? (
                        <img src={currentProject.imageUrl} className="h-full w-full object-cover" alt="Preview" />
                      ) : (
                        <span className="flex flex-col items-center gap-3 text-sm font-black uppercase text-text-muted">
                          <Upload size={28} />
                          Upload image
                        </span>
                      )}
                    </button>
                    <input id="imageUpload" type="file" hidden onChange={handleHeroFileUpload} accept="image/*,.gif" />
                  </div>
                  <label className="block text-sm font-bold text-text-muted">
                    Or paste hero image URL
                    <input
                      type="text"
                      value={currentProject.imageUrl}
                      onChange={(event) => setCurrentProject({ ...currentProject, imageUrl: event.target.value })}
                      onBlur={handleHeroUrlBlur}
                      className="mt-2 w-full rounded-2xl border border-glass-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
                      placeholder="https://..."
                    />
                  </label>
                  <div className="rounded-[24px] border border-glass-border bg-surface p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-black text-text">Product page images</p>
                        <p className="mt-1 text-xs font-bold text-text-muted">Images and GIFs appear on the product page gallery.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => document.getElementById('mediaUpload')?.click()}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-xs font-black uppercase text-background"
                      >
                        <Upload size={16} />
                        Upload
                      </button>
                      <input id="mediaUpload" type="file" hidden multiple onChange={handleMediaFileUpload} accept="image/*,.gif" />
                    </div>

                    <div className="mt-4 grid gap-3">
                      <label className="block text-xs font-bold text-text-muted">
                        Media URL
                        <input
                          type="text"
                          value={mediaUrlInput}
                          onChange={(event) => setMediaUrlInput(event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-glass-border bg-background px-4 py-3 text-text outline-none focus:border-primary"
                          placeholder="https://.../image-or-animation.gif"
                        />
                      </label>
                      <label className="block text-xs font-bold text-text-muted">
                        Caption
                        <input
                          type="text"
                          value={mediaCaptionInput}
                          onChange={(event) => setMediaCaptionInput(event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-glass-border bg-background px-4 py-3 text-text outline-none focus:border-primary"
                          placeholder="Onboarding flow"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleAddMediaUrl}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-glass-border px-4 py-3 text-xs font-black uppercase text-text"
                      >
                        <Plus size={16} />
                        Add URL
                      </button>
                    </div>

                    <div className="mt-5 space-y-3">
                      {(currentProject.media || []).length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-glass-border px-4 py-6 text-center text-sm font-bold text-text-muted">
                          No gallery media yet.
                        </div>
                      ) : (
                        (currentProject.media || []).map((item, index) => (
                          <div key={item.id} className="grid gap-3 rounded-2xl border border-glass-border bg-background p-3">
                            <div className="grid gap-3 sm:grid-cols-[96px_1fr]">
                              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface">
                                {item.url ? (
                                  <img
                                    src={item.url}
                                    alt={item.alt || item.caption || 'Gallery media'}
                                    className="h-full w-full object-cover"
                                    onError={(event) => {
                                      event.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : null}
                                {item.type === 'gif' && (
                                  <span className="absolute bottom-2 left-2 rounded-full bg-text px-2 py-1 text-[10px] font-black uppercase text-background">
                                    GIF
                                  </span>
                                )}
                              </div>
                              <div className="grid gap-2">
                                <input
                                  type="text"
                                  value={item.url}
                                  onChange={(event) => updateMediaItem(item.id, { url: event.target.value, type: inferMediaType(event.target.value) })}
                                  className="w-full rounded-xl border border-glass-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary"
                                  aria-label="Media URL"
                                />
                                <input
                                  type="text"
                                  value={item.caption}
                                  onChange={(event) => updateMediaItem(item.id, { caption: event.target.value })}
                                  className="w-full rounded-xl border border-glass-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary"
                                  placeholder="Caption"
                                  aria-label="Media caption"
                                />
                                <input
                                  type="text"
                                  value={item.alt}
                                  onChange={(event) => updateMediaItem(item.id, { alt: event.target.value })}
                                  className="w-full rounded-xl border border-glass-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary"
                                  placeholder="Alt text"
                                  aria-label="Media alt text"
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs font-black uppercase text-text-muted">Item {index + 1}</span>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => moveMediaItem(item.id, -1)}
                                  disabled={index === 0}
                                  className="grid h-9 w-9 place-items-center rounded-full border border-glass-border text-text"
                                  aria-label="Move media up"
                                >
                                  <GripVertical size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveMediaItem(item.id, 1)}
                                  disabled={index === (currentProject.media || []).length - 1}
                                  className="grid h-9 w-9 place-items-center rounded-full border border-glass-border text-text"
                                  aria-label="Move media down"
                                >
                                  <GripVertical size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeMediaItem(item.id)}
                                  className="grid h-9 w-9 place-items-center rounded-full bg-red-500 text-white"
                                  aria-label="Remove media"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-text px-6 py-4 text-sm font-black uppercase text-background disabled:opacity-50"
                  >
                    <Save size={18} />
                    {loading ? 'Saving' : 'Save work'}
                  </button>
                </div>
              </form>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
