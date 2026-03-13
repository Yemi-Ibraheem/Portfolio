import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Save, LogOut, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:5000/api';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const savedPassword = localStorage.getItem('adminPassword');
    if (savedPassword) {
      setPassword(savedPassword);
      checkAuth(savedPassword);
    }
  }, []);

  const checkAuth = async (pwd) => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('adminPassword', pwd);
        fetchProjects();
      }
    } catch (error) {
      console.error('Auth check failed', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // We'll trust the first request to fail if password is wrong in later actions
    // For now, simple check - in a real app we'd have a /login endpoint
    setIsAuthenticated(true);
    localStorage.setItem('adminPassword', password);
    fetchProjects();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('adminPassword');
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Fetch projects failed', error);
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    let updatedProjects;
    if (currentProject.id) {
      updatedProjects = projects.map(p => p.id === currentProject.id ? currentProject : p);
    } else {
      const newId = (Math.max(0, ...projects.map(p => parseInt(p.id))) + 1).toString();
      updatedProjects = [...projects, { ...currentProject, id: newId }];
    }

    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify(updatedProjects)
      });

      if (res.ok) {
        setProjects(updatedProjects);
        setIsEditing(false);
        setStatusMessage('Saved successfully!');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        alert('Failed to save. Check password.');
      }
    } catch (error) {
      console.error('Save failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    const updatedProjects = projects.filter(p => p.id !== id);
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify(updatedProjects)
      });

      if (res.ok) {
        setProjects(updatedProjects);
        setStatusMessage('Deleted successfully!');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          'x-admin-password': password
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentProject({ ...currentProject, imageUrl: data.imageUrl });
      } else {
        alert('Upload failed. Check password.');
      }
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-black rounded-xl">
              <Key className="text-white w-6 h-6" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">CMS Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your portfolio projects</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setCurrentProject({ title: '', role: '', year: new Date().getFullYear().toString(), description: '', imageUrl: '', behanceLink: '', tags: [] });
              setIsEditing(true);
            }}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
          >
            <Plus size={20} /> Add Project
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {statusMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-center font-medium"
        >
          {statusMessage}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setCurrentProject(project);
                    setIsEditing(true);
                  }}
                  className="p-3 bg-white rounded-full text-black hover:bg-gray-100 transition-colors"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{project.year} • {project.role}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] bg-gray-100 px-2 py-1 rounded-full font-medium text-gray-600 capitalize">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <h2 className="text-2xl font-bold">{currentProject.id ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-black">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                      <input
                        type="text"
                        value={currentProject.title}
                        onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        value={currentProject.role}
                        onChange={(e) => setCurrentProject({ ...currentProject, role: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input
                        type="text"
                        value={currentProject.year}
                        onChange={(e) => setCurrentProject({ ...currentProject, year: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Behance Link</label>
                      <input
                        type="url"
                        value={currentProject.behanceLink}
                        onChange={(e) => setCurrentProject({ ...currentProject, behanceLink: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
                      <div 
                        className="relative h-40 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col items-center justify-center bg-gray-50 group hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => document.getElementById('imageUpload').click()}
                      >
                        {currentProject.imageUrl ? (
                          <img src={currentProject.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <div className="text-center">
                            <Upload className="mx-auto text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500 font-medium">Click to upload image</span>
                          </div>
                        )}
                        <input 
                          id="imageUpload"
                          type="file" 
                          hidden 
                          onChange={handleFileUpload}
                          accept="image/*"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={currentProject.tags.join(', ')}
                        onChange={(e) => setCurrentProject({ ...currentProject, tags: e.target.value.split(',').map(t => t.trim()) })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                        placeholder="UI Design, Web, Mobile"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows="4"
                    value={currentProject.description}
                    onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    required
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 shadow-xl shadow-black/10"
                  >
                    {loading ? 'Saving...' : <><Save size={20} /> Save Project</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
