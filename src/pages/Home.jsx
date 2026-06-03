import React, { useEffect, useRef, useState } from 'react';
import Hero from '../components/Hero';
import ProjectGrid from '../components/ProjectGrid';
import { useProjects } from '../hooks/useProjects';

const processSteps = [
  {
    title: 'Understand the Mission',
    body: 'Every successful product starts with understanding the problem before designing a solution. At the beginning of a project, I work closely with stakeholders to understand business objectives, user needs, technical constraints, and success metrics. I review existing products, analyse competitors, and identify opportunities within the market. This discovery phase ensures that design decisions are aligned with both business goals and user expectations from the very start.',
  },
  {
    title: 'Research the Users',
    body: 'Once the objectives are clear, I focus on understanding the people who will use the product. Through user interviews, surveys, workshops, analytics reviews, and competitor analysis, I gather insights into user behaviours, motivations, frustrations, and goals. This research helps uncover real user needs and prevents assumptions from driving design decisions. The findings are then synthesised into personas, user needs, and key opportunities for improvement.',
  },
  {
    title: 'Map the Experience',
    body: "Using the insights gathered during research, I begin structuring the overall experience. This involves creating user journeys, task flows, information architecture, and user stories that map how users will interact with the product. By visualising the user's path from start to finish, I can identify pain points, remove unnecessary complexity, and ensure that the experience is intuitive and easy to navigate.",
  },
  {
    title: 'Sketch and Wireframe',
    body: "Before investing time in visual design, I explore ideas through low-fidelity sketches and wireframes. This stage focuses on layout, content hierarchy, navigation, and functionality without the distraction of colours or branding. Wireframing allows me to rapidly test concepts, gather feedback, and iterate on solutions while ensuring that the product's structure supports user goals effectively.",
  },
  {
    title: 'Design the Interface',
    body: 'With a validated structure in place, I move into high-fidelity UI design. This is where the product begins to take shape visually through the application of typography, colour systems, spacing, imagery, and reusable components. I create interfaces that are not only visually appealing but also accessible, consistent, and scalable. Design systems and component libraries are often used to ensure efficiency and maintain consistency across the product.',
  },
  {
    title: 'Prototype the Experience',
    body: 'To bring the design to life, I create interactive prototypes that simulate the final user experience. Prototypes allow stakeholders, developers, and users to interact with the product before development begins. This stage helps validate user flows, test interactions, communicate design intent, and identify potential usability issues early, reducing costly changes later in the project lifecycle.',
  },
  {
    title: 'Test, Learn and Improve',
    body: 'Design is an iterative process, and testing plays a critical role in ensuring the final solution meets user needs. Through usability testing sessions, stakeholder reviews, accessibility checks, and feedback gathering, I evaluate how users interact with the product. The insights collected are used to refine the design, address friction points, and improve the overall user experience. This cycle of testing and iteration continues until the solution performs effectively for both users and the business.',
  },
  {
    title: 'Handoff and Support Development',
    body: 'Once the design is validated, I prepare detailed specifications, documentation, and assets for development. I work closely with engineers throughout implementation, providing guidance, answering questions, and conducting quality assurance reviews to ensure the final product reflects the intended design. My involvement continues beyond handoff to help maintain design quality and identify opportunities for future improvements after launch.',
  },
];

const Home = () => {
  const { projects, isLoading } = useProjects();
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const updateActiveStep = () => {
      const viewportFocus = window.innerHeight * 0.25;
      const closestStep = stepRefs.current.reduce(
        (closest, step, index) => {
          if (!step) return closest;

          const distance = Math.abs(step.getBoundingClientRect().top - viewportFocus);
          return distance < closest.distance ? { distance, index } : closest;
        },
        { distance: Number.POSITIVE_INFINITY, index: 0 }
      );

      setActiveStep(closestStep.index);
    };

    updateActiveStep();
    window.addEventListener('scroll', updateActiveStep, { passive: true });
    window.addEventListener('resize', updateActiveStep);

    return () => {
      window.removeEventListener('scroll', updateActiveStep);
      window.removeEventListener('resize', updateActiveStep);
    };
  }, []);

  return (
    <div className="w-full">
      <Hero projects={projects} isLoading={isLoading} />
      <ProjectGrid projects={projects} />
      <section id="process" className="w-full bg-surface px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1500px] gap-10 md:grid-cols-[0.55fr_1.45fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <p className="text-sm font-black uppercase text-text-muted">Process</p>
          </div>
          <div className="grid gap-14">
            {processSteps.map((step, index) => {
              const isActive = activeStep === index;

              return (
                <article
                  key={step.title}
                  ref={(element) => {
                    stepRefs.current[index] = element;
                  }}
                  data-step-index={index}
                  className={`max-w-5xl transition-colors duration-500 ${isActive ? 'text-text' : 'text-text-muted'}`}
                >
                  <p className="mb-3 text-sm font-black uppercase opacity-60">{String(index + 1).padStart(2, '0')}</p>
                  <h2 className="text-3xl font-black leading-tight sm:text-5xl">{step.title}</h2>
                  <p className="mt-5 text-lg font-semibold leading-relaxed sm:text-2xl">{step.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
