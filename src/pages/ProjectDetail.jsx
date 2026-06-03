import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects } = useProjects();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-28">
        <div className="text-center">
          <h1 className="text-4xl font-black text-text">Project not found</h1>
          <Link to="/" className="mt-5 inline-flex rounded-full bg-text px-6 py-3 text-sm font-black uppercase text-background">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background px-4 pb-20 pt-28 text-text sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1500px]">
        <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm font-black uppercase text-text-muted hover:text-text">
          <ArrowLeft size={18} />
          Back to work
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase text-primary">{project.year} / {project.role}</p>
            <h1 className="mt-4 max-w-5xl text-[clamp(3.2rem,9vw,9rem)] font-black leading-[0.88]">{project.title}</h1>
          </div>
          <p className="text-xl leading-relaxed text-text-muted">{project.description}</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[32px] bg-surface">
          {project.imageUrl && (
            <img src={project.imageUrl} alt={project.title} className="h-full max-h-[760px] w-full object-cover" />
          )}
        </div>

        <div className="mt-12 grid gap-10 border-y border-glass-border py-8 md:grid-cols-4">
          <div>
            <p className="text-xs font-black uppercase text-text-muted">Role</p>
            <p className="mt-2 text-lg font-bold">{project.role}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-text-muted">Industry</p>
            <p className="mt-2 text-lg font-bold">{project.industry || project.role}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-text-muted">Year</p>
            <p className="mt-2 text-lg font-bold">{project.year}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-text-muted">Services</p>
            <p className="mt-2 text-lg font-bold">{project.tags.join(', ')}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <h2 className="text-4xl font-black leading-tight md:text-6xl">A focused digital piece built for clarity, momentum, and launch.</h2>
          <div className="space-y-6 text-lg leading-relaxed text-text-muted">
            <p>{project.description}</p>
            <p>
              This case page uses the CMS project record as its source of truth. Update the image, tags, role, industry, link, or write-up in the CMS and the public portfolio follows along.
            </p>
            {project.behanceLink && (
              <a
                href={project.behanceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-black uppercase text-background transition-transform hover:-translate-y-1"
              >
                View full case
                <ArrowUpRight size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default ProjectDetail;
