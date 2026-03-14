import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import projectsData from '../data/projects.json';

const ProjectGrid = () => {
  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text mb-2">Selected Works</h2>
          <p className="text-text-muted text-lg">A collection of my recent projects</p>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-text hover:text-primary transition-colors font-medium underline underline-offset-4"
        >
          View all on Behance
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
        {projectsData.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ProjectGrid;
