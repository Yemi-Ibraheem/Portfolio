import fallbackProjects from '../data/projects.json';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const resolveMediaUrl = (url = '') => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) return url;
  return url;
};

export const normaliseStoredMediaUrl = (url = '') => {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) return '';
  if (trimmedUrl.startsWith('/uploads/')) return trimmedUrl;

  try {
    const parsedUrl = new URL(trimmedUrl, typeof window === 'undefined' ? 'http://localhost' : window.location.origin);
    if (parsedUrl.pathname.startsWith('/uploads/')) {
      return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    }
  } catch {
    return trimmedUrl;
  }

  return trimmedUrl;
};

export const inferMediaType = (url = '') => {
  const cleanUrl = url.split('?')[0].toLowerCase();

  if (cleanUrl.startsWith('data:image/gif')) return 'gif';
  if (cleanUrl.endsWith('.gif')) return 'gif';
  return 'image';
};

const normaliseMediaItem = (item, index) => {
  if (typeof item === 'string') {
    return {
      id: `media-${index}`,
      url: resolveMediaUrl(item),
      caption: '',
      alt: '',
      type: inferMediaType(item),
    };
  }

  const url = resolveMediaUrl(item?.url ?? item?.src ?? '');

  return {
    id: String(item?.id ?? `media-${index}`),
    url,
    caption: item?.caption ?? item?.label ?? '',
    alt: item?.alt ?? item?.caption ?? '',
    type: item?.type ?? inferMediaType(url),
  };
};

const normaliseDetailSection = (section, index) => {
  const copy = Array.isArray(section?.copy)
    ? section.copy
    : String(section?.copy ?? '')
        .split('\n')
        .map((paragraph) => paragraph.trim());

  return {
    title: section?.title ?? ['Context', 'Approach', 'Outcome'][index] ?? `Section ${index + 1}`,
    copy: copy.filter(Boolean),
  };
};

const normaliseProject = (project) => {
  const media = Array.isArray(project.media) ? project.media : project.gallery;
  const detailSections = Array.isArray(project.detailSections)
    ? project.detailSections.map(normaliseDetailSection).filter((section) => section.copy.length > 0)
    : [];

  return {
    id: String(project.id ?? ''),
    title: project.title ?? '',
    role: project.role ?? '',
    year: project.year ?? '',
    teamSize: project.teamSize ?? '',
    description: project.description ?? '',
    detailIntro: project.detailIntro ?? '',
    imageUrl: resolveMediaUrl(project.imageUrl ?? ''),
    behanceLink: project.behanceLink ?? '',
    industry: project.industry ?? project.role ?? '',
    tags: Array.isArray(project.tags) ? project.tags : [],
    media: Array.isArray(media) ? media.map(normaliseMediaItem).filter((item) => item.url) : [],
    detailSections,
  };
};

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
