import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';

const accentPalette = ['#e6542d', '#0e766e', '#7a4cc2', '#b75f1b'];

const getProjectAccent = (projectId) => {
  const idTotal = String(projectId)
    .split('')
    .reduce((total, character) => total + character.charCodeAt(0), 0);

  return accentPalette[idTotal % accentPalette.length];
};

const getFocusLine = (project) => {
  if (project.tags.length > 0) {
    return project.tags.join(' / ');
  }

  return project.industry || project.role || 'Product Design';
};

const getProjectSections = (project) => {
  if (project.detailSections.length > 0) {
    return project.detailSections;
  }

  const focusLine = getFocusLine(project);
  const industry = project.industry || 'digital product';

  return [
    {
      title: 'Context',
      copy: [
        project.description,
        `The brief called for a clear ${industry.toLowerCase()} experience that could translate complex needs into a calmer, more direct product journey.`,
      ],
    },
    {
      title: 'Approach',
      copy: [
        `I shaped the work around ${focusLine.toLowerCase()}, using the project goals to define the right hierarchy, interaction model, and visual system.`,
        'The design direction keeps the interface focused: fewer competing elements, stronger moments for decision-making, and a structure that stays easy to scan.',
      ],
    },
    {
      title: 'Outcome',
      copy: [
        `The final direction gives the ${industry.toLowerCase()} product a more confident flow, supported by a visual language that feels polished without getting in the way.`,
      ],
    },
  ];
};

const getGalleryItems = (project) => {
  if (project.media.length > 0) {
    return project.media.map((item, index) => ({
      title: item.caption || '',
      label: item.type === 'gif' ? 'Animated sequence' : `Gallery ${index + 1}`,
      url: item.url,
      alt: item.alt || item.caption || `${project.title} gallery media ${index + 1}`,
      type: item.type,
      objectPosition: 'center',
    }));
  }

  return [
    {
      title: project.title,
      label: 'Product direction',
      url: project.imageUrl,
      alt: `${project.title} product direction`,
      type: 'image',
      objectPosition: 'center',
    },
    {
      title: project.industry || project.role,
      label: 'Experience system',
      url: project.imageUrl,
      alt: `${project.title} experience system`,
      type: 'image',
      objectPosition: 'left center',
    },
    {
      title: project.tags[0] || project.role,
      label: 'Interface detail',
      url: project.imageUrl,
      alt: `${project.title} interface detail`,
      type: 'image',
      objectPosition: 'right center',
    },
  ];
};

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

  const accent = getProjectAccent(project.id);
  const sections = getProjectSections(project);
  const galleryItems = getGalleryItems(project);
  const detailIntro = project.detailIntro || project.description;

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen px-4 pb-20 pt-28 text-text sm:px-6 lg:px-8"
      style={{
        '--case-accent': accent,
        background:
          'linear-gradient(180deg, var(--background) 0%, color-mix(in srgb, var(--case-accent) 8%, var(--background)) 26%, var(--background) 92%)',
      }}
    >
      <div className="mx-auto max-w-[1150px]">
        <Link
          to="/#work"
          className="inline-flex items-center gap-2 text-sm font-bold text-text-muted transition duration-200 hover:scale-105 hover:text-text"
        >
          <ArrowLeft size={18} />
          Back to work
        </Link>

        <section className="grid min-h-[620px] items-center gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,720px)_1fr] lg:py-24">
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="order-2 lg:order-1"
          >
            <p className="text-3xl font-black leading-none text-[var(--case-accent)] md:text-4xl">
              {project.title}
            </p>
            <h1 className="mt-4 max-w-[760px] text-3xl font-black leading-tight text-text sm:text-4xl lg:text-5xl">
              {detailIntro}
            </h1>

            <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-5 sm:grid-cols-4">
              {[
                ['Role', project.role],
                ['Industry', project.industry || project.role],
                ['Team size', project.teamSize || 'Team size'],
                ['Year', project.year],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-xs font-black uppercase text-text-muted">{label}</dt>
                  <dd className="mt-1 text-base font-bold leading-tight text-text sm:text-lg">{value}</dd>
                </div>
              ))}
            </dl>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: 8 }}
            animate={{ opacity: 1, scale: 1, rotate: 5 }}
            whileHover={{ scale: 1.035, rotate: 2 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="order-1 mx-auto w-full max-w-[380px] [perspective:1000px] lg:order-2"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface shadow-[18px_22px_0_color-mix(in_srgb,var(--case-accent)_28%,transparent),0_30px_80px_rgba(0,0,0,0.16)] [transform:rotateX(10deg)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,color-mix(in_srgb,var(--case-accent)_24%,transparent),transparent_34%),linear-gradient(135deg,var(--surface),var(--background))]" />
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <span className="text-xs font-black uppercase text-text-muted">{project.industry || project.role}</span>
                <div>
                  <p className="max-w-[12rem] text-3xl font-black leading-none text-text">{project.title}</p>
                  <p className="mt-2 text-sm font-bold uppercase text-[var(--case-accent)]">{project.year}</p>
                </div>
              </div>
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable="false"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
            </div>
          </Motion.div>
        </section>

        <section className="space-y-14 pb-10">
          {sections.map((section, index) => (
            <Motion.article
              key={section.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="max-w-[760px]"
            >
              <h2 className="text-2xl font-black text-[var(--case-accent)] md:text-3xl">{section.title}</h2>
              <div className="mt-5 space-y-5 text-xl font-semibold leading-relaxed text-text md:text-2xl">
                {section.copy.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Motion.article>
          ))}
        </section>

        <section className="py-10">
          <Motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-black text-[var(--case-accent)] md:text-3xl"
          >
            Gallery
          </Motion.h2>

          <div className="mt-6 grid gap-4 sm:block">
            <div className="sm:relative sm:left-1/2 sm:-ml-[50vw] sm:w-screen sm:overflow-x-auto sm:pb-4">
              <div className="grid gap-4 sm:flex sm:w-max sm:gap-6 sm:px-[max(1.5rem,calc((100vw-1150px)/2))]">
                {galleryItems.map((item, index) => (
                  <Motion.figure
                    key={`${item.title}-${index}`}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.42, delay: index * 0.08 }}
                    className="relative min-h-[360px] overflow-hidden rounded-lg bg-surface sm:h-[520px] sm:w-[580px]"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,color-mix(in_srgb,var(--case-accent)_22%,transparent),transparent_30%),linear-gradient(135deg,var(--surface),var(--background))]" />
                    <div className="absolute right-6 top-6 text-6xl font-black leading-none text-[color-mix(in_srgb,var(--case-accent)_24%,transparent)]">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    {item.url && (
                      <img
                        src={item.url}
                        alt={item.alt}
                        className="absolute inset-0 h-full w-full object-cover opacity-[0.92]"
                        style={{ objectPosition: item.objectPosition }}
                        draggable="false"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    {item.title && (
                      <figcaption className="absolute bottom-8 left-8 max-w-[260px] rounded-md bg-surface/82 px-4 py-3 backdrop-blur-sm">
                        <p className="text-xl font-semibold leading-tight text-text">{item.title}</p>
                      </figcaption>
                    )}
                    {item.type === 'gif' && (
                      <div className="absolute right-6 top-6 rounded-full bg-text px-3 py-2 text-xs font-black uppercase text-background">
                        GIF
                      </div>
                    )}
                  </Motion.figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4 border-t border-glass-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/#work"
            className="inline-flex w-fit items-center gap-2 text-base font-black text-text-muted transition hover:scale-105 hover:text-text"
          >
            <ArrowLeft size={18} />
            See all projects
          </Link>
        </div>
      </div>
    </Motion.div>
  );
};

export default ProjectDetail;
