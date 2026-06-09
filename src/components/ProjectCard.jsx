import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, index }) => {
  return (
    <Motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] lg:items-end"
    >
      <Link to={`/project/${project.id}`} className="relative block aspect-[16/10] overflow-hidden rounded-[28px] bg-surface">
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/18" />
        <div className="absolute right-5 top-5 grid h-14 w-14 translate-y-3 place-items-center rounded-full bg-text text-background opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={24} />
        </div>
      </Link>

      <div className="border-t border-glass-border pt-6 lg:border-t-0 lg:pt-0">
        <div className="mb-5 flex items-center justify-between gap-4 text-xs font-black uppercase text-text-muted">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{project.teamSize || 'Team size'}</span>
        </div>

        <h3 className="text-4xl font-black leading-[0.95] text-text sm:text-5xl">{project.title}</h3>
        <p className="mt-5 text-lg leading-relaxed text-text-muted">{project.description}</p>

        <div className="mt-6 grid grid-cols-2 gap-4 border-y border-glass-border py-5">
          <div>
            <p className="text-xs font-black uppercase text-text-muted">Role</p>
            <p className="mt-2 font-bold text-text">{project.role}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-text-muted">Industry</p>
            <p className="mt-2 font-bold text-text">{project.industry || project.role}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag, i) => (
            <span key={i} className="rounded-full border border-glass-border px-3 py-2 text-xs font-bold uppercase text-text-muted">
              {tag}
            </span>
          ))}
        </div>

        <Link
          to={`/project/${project.id}`}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-text px-6 py-4 text-sm font-black uppercase text-background transition-transform hover:-translate-y-1"
        >
          Open case
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </Motion.article>
  );
};

export default ProjectCard;
