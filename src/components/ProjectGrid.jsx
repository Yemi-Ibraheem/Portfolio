import React from 'react';
import { motion as Motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

const ProjectGrid = ({ projects = [] }) => {
  return (
    <section id="work" className="w-full bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-12 grid gap-6 border-y border-glass-border py-6 md:grid-cols-[1fr_420px] md:items-end">
          <Motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-black tracking-tight text-text md:text-7xl">Selected work</h2>
            <p className="mt-3 text-lg text-text-muted">Uploaded CMS projects become the hero slider and the case-study flow below.</p>
          </Motion.div>

          <Motion.a
            href="https://www.behance.net/yemiui"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="justify-self-start text-sm font-black uppercase text-text underline decoration-primary decoration-2 underline-offset-8 transition-colors hover:text-primary md:justify-self-end"
          >
            View all on Behance
          </Motion.a>
        </div>

        <div className="space-y-20">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectGrid;
