import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = ({ projects = [], isLoading }) => {
  const marqueeProjects = projects.length ? [...projects, ...projects] : [];

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-background px-4 pb-4 pt-28 sm:px-6 lg:min-h-[82svh] lg:px-8 lg:pb-4 lg:pt-22">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent" />
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-end">
        <Motion.div
          className="grid gap-6 pb-10 md:grid-cols-2 md:items-start lg:gap-12 lg:pb-20"
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12 }}
        >
          <div>
            <Motion.div variants={itemVariants} className="mb-5 flex flex-wrap gap-1.5 text-[10px] font-bold uppercase text-text-muted lg:mb-4">
              <span className="rounded-full border border-glass-border px-1.5 py-1">+ Product design</span>
              <span className="rounded-full border border-glass-border px-1.5 py-1">+ UI</span>
              <span className="rounded-full border border-glass-border px-1.5 py-1">+ UX</span>
              <span className="rounded-full border border-glass-border px-1.5 py-1">+ Apps</span>
              <span className="rounded-full border border-glass-border px-1.5 py-1">+ Websites</span>
              <span className="rounded-full border border-glass-border px-1.5 py-1">+ London / Remote</span>
            </Motion.div>
            <Motion.h1
              variants={itemVariants}
              className="max-w-full text-[clamp(3rem,7.4vw,5.8rem)] font-black leading-[0.88] text-text lg:text-[clamp(4rem,5.6vw,6.6rem)]"
            >
              Designs powered by research and experience
            </Motion.h1>
          </div>

          <Motion.div variants={itemVariants} className="max-w-lg justify-self-start md:mt-14 md:justify-self-end lg:mt-16">
            <p className="mb-5 text-base leading-relaxed text-text-muted lg:text-base">
              I'm a Senior UX/Product Designer with 10+ years of experience designing digital products that solve real user problems and deliver measurable business results. Having worked with top companies and innovative startups, I combine user research, product strategy, and intuitive UI design to transform complex challenges into seamless experiences. from discovery and prototyping to testing and delivery.
            </p>
            <a
              href="mailto:yemi_aiyeola@hotmail.com"
              className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-4 text-sm font-black uppercase text-background transition-transform hover:-translate-y-1"
            >
              Lets chat
              <ArrowDownRight size={18} />
            </a>
          </Motion.div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[28px] border border-glass-border bg-surface"
        >
          <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-surface to-transparent" />
          <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-surface to-transparent" />
          <div className="work-marquee flex gap-4 p-3">
            {marqueeProjects.map((project, index) => (
              <Link
                key={`${project.id}-${index}`}
                to={`/project/${project.id}`}
                className="group relative h-[170px] w-[260px] shrink-0 overflow-hidden rounded-[20px] bg-background sm:h-[190px] sm:w-[310px] lg:h-[180px] lg:w-[300px]"
              >
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-bold uppercase opacity-75">{project.year}</p>
                  <h2 className="mt-1 text-xl font-black leading-none">{project.title}</h2>
                </div>
              </Link>
            ))}
            {isLoading && <div className="h-[170px] w-[260px] shrink-0 animate-pulse rounded-[20px] bg-background sm:h-[190px] sm:w-[310px] lg:h-[180px] lg:w-[300px]" />}
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default Hero;
