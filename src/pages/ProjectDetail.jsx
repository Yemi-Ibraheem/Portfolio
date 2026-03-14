import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import projectsData from '../data/projects.json';

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projectsData.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <h1 className="text-3xl text-text">Project not found</h1>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen text-text pt-10 px-4 bg-background transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-text-muted hover:text-text transition-colors mb-12"
        >
          <ArrowLeft size={20} />
          Back to Works
        </Link>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{project.title}</h1>
              <p className="text-xl text-text-muted max-w-2xl leading-relaxed">{project.description}</p>
            </div>
            
            <div className="flex flex-col gap-2 md:text-right shrink-0">
              <div className="text-text-muted text-sm uppercase tracking-widest">Role</div>
              <div className="text-lg font-medium">{project.role}</div>
              <div className="text-text-muted text-sm uppercase tracking-widest mt-4">Year</div>
              <div className="text-lg font-medium">{project.year}</div>
            </div>
          </div>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full aspect-auto md:aspect-[21/9] rounded-xl overflow-hidden mb-16 shadow-2xl border border-glass-border"
          >
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
            <div className="md:col-span-2 space-y-6 text-text-muted text-lg leading-relaxed">
              <h2 className="text-3xl font-bold text-text mb-6">About the project</h2>
              <p>
                This project represents a deep dive into modern user experience principles, focusing on creating seamless interactions and a beautiful, intuitive interface. The goal was to align user needs with business objectives while maintaining a high aesthetic standard.
              </p>
              <p>
                Through rigorous user research, wireframing, and iterative prototyping, we developed a solution that not only meets but exceeds expectations. The final product delivers a compelling narrative and a visually stunning experience.
              </p>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-text mb-4">Technologies & Approaches</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="px-4 py-2 rounded-full text-sm border border-glass-border bg-surface/50 text-text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <a 
                  href={project.behanceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-6 py-4 bg-primary text-background font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  View Full Case Study
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
