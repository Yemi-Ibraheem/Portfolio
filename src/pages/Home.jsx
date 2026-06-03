import React from 'react';
import Hero from '../components/Hero';
import ProjectGrid from '../components/ProjectGrid';
import { useProjects } from '../hooks/useProjects';

const Home = () => {
  const { projects, isLoading } = useProjects();

  return (
    <div className="w-full">
      <Hero projects={projects} isLoading={isLoading} />
      <ProjectGrid projects={projects} />
      <section id="process" className="w-full bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1500px] gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <p className="text-sm font-black uppercase text-text-muted">Process</p>
          <div className="grid gap-6 text-2xl font-black leading-tight text-text sm:text-4xl">
            <p>Discovery, product direction, interface systems, and launch polish.</p>
            <p className="text-text-muted">The work stays practical: clear user journeys, strong visual hierarchy, and a site that makes the portfolio piece easy to understand.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
