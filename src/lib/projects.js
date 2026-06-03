import fallbackProjects from '../data/projects.json';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const normaliseProject = (project) => ({
  id: String(project.id ?? ''),
  title: project.title ?? '',
  role: project.role ?? '',
  year: project.year ?? '',
  description: project.description ?? '',
  imageUrl: project.imageUrl ?? '',
  behanceLink: project.behanceLink ?? '',
  industry: project.industry ?? project.role ?? '',
  tags: Array.isArray(project.tags) ? project.tags : [],
});

export const normaliseProjects = (projects) =>
  Array.isArray(projects) ? projects.map(normaliseProject) : [];

export const fallbackProjectList = normaliseProjects(fallbackProjects);

export async function fetchProjects() {
  const response = await fetch(`${API_BASE}/projects`);

  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status}`);
  }

  return normaliseProjects(await response.json());
}
