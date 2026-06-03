import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Save, LogOut, Key, GripVertical } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { API_BASE, fallbackProjectList, normaliseProjects } from '../lib/projects';

const emptyProject = () => ({
  title: '',
  role: '',
  year: new Date().getFullYear().toString(),
  description: '',
  imageUrl: '',
  behanceLink: '',
  industry: '',
  tags: [],
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
    };

    const updatedProjects = currentProject.id
      ? projects.map((project) => (project.id === currentProject.id ? normalisedCurrent : project))
      : [...projects, normalisedCurrent];

    try {
      await persistProjects(updatedProjects, 'Project saved.');
      setIsEditing(false);
      setCurrentProject(emptyProject());
    } catch (error) {
      console.error('Save failed', error);
      showError('Save failed. Confirm the CMS server is running and the password is correct.');
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setCurrentProject((project) => ({ ...project, imageUrl: data.imageUrl }));
      showStatus('Image uploaded.');
    } catch (error) {
      console.error('Upload failed', error);
      showError('Upload failed. Confirm the CMS server is running and the password is correct.');
    } finally {
      setLoading(false);
    }
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
                <p className="text-xs font-black uppercase text-text-muted">{project.year} / {project.role}</p>
                <h2 className="mt-2 text-3xl font-black leading-none">{project.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-glass-border px-3 py-1 text-[11px] font-bold uppercase text-text-muted">
                      {tag}
                    </span>
                  ))}
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
                  <div className="grid gap-4 md:grid-cols-3">
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
                    Description
                    <textarea
                      rows="7"
                      value={currentProject.description}
                      onChange={(event) => setCurrentProject({ ...currentProject, description: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-glass-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
                      required
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-bold text-text-muted">Portfolio image</p>
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
                    <input id="imageUpload" type="file" hidden onChange={handleFileUpload} accept="image/*" />
                  </div>
                  <label className="block text-sm font-bold text-text-muted">
                    Or paste image URL
                    <input
                      type="url"
                      value={currentProject.imageUrl}
                      onChange={(event) => setCurrentProject({ ...currentProject, imageUrl: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-glass-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
                      placeholder="https://..."
                    />
                  </label>
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
