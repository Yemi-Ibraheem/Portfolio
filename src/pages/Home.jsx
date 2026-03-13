import React from 'react';
import Hero from '../components/Hero';
import ProjectGrid from '../components/ProjectGrid';

const Home = () => {
  return (
    <div className="w-full">
      <Hero />
      <section id="projects" className="pt-10 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
        <ProjectGrid />
      </section>
    </div>
  );
};

export default Home;
