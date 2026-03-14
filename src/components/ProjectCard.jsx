import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, index }) => {
  return (
    <Link to={`/project/${project.id}`} className="block w-full">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group relative flex flex-col gap-4 w-full cursor-pointer"
      >
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface border border-glass-border">
        <motion.img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-text text-background flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight size={28} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-start justify-between">
          <h3 className="text-2xl font-bold text-text group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <span className="text-text-muted font-mono text-sm">{project.year}</span>
        </div>
        
        <p className="text-text-muted">{project.role}</p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {project.tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 rounded-full text-xs border border-glass-border text-text-muted group-hover:border-primary/30 transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
    </Link>
  );
};

export default ProjectCard;
