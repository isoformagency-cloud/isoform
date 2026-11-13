import { useState } from 'react';
import SpotlightCard from '../components/bits/SpotlightCard.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { ProjectLink, ProjectVisual } from '../components/Frames.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { filters, projects } from '../data/projects.js';

export default function Work() {
  const [filter, setFilter] = useState('all');
  const visible = projects.filter((project) => filter === 'all' || project.filter === filter);

  return (
    <>
      <PageHeader
        label="Work"
        title="Built, launched *and live.*"
        lead="Every project below is a real client you can visit today. Open the sites, scroll the feeds, and judge for yourself."
      />

      <section className="wrap pb-20 md:pb-28" aria-labelledby="projects-title">
        <h2 id="projects-title" className="sr-only">
          Projects
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line pt-8">
          <div role="group" aria-label="Filter projects by type" className="flex flex-wrap gap-2">
            {filters.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(item.id)}
                  className={`h-11 rounded-full border px-5 text-[0.9375rem] transition-colors ${
                    active
                      ? 'border-white bg-white font-medium text-ink'
                      : 'border-white/20 text-muted hover:border-white/50 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          {/* announces the filter change to screen readers, without counts */}
          <p className="sr-only" aria-live="polite">
            Showing {filter === 'all' ? 'all projects' : `${filters.find((item) => item.id === filter).label} projects`}
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-6 md:mt-12 lg:grid-cols-2 lg:gap-8">
          {visible.map((project, index) => (
            <li key={`${filter}-${project.id}`} className="fade-up" style={{ '--delay': `${index * 70}ms` }}>
              <SpotlightCard as="article" className="flex h-full flex-col rounded-[1.75rem] bg-surface">
                <div className="px-6 pt-8 sm:px-10 sm:pt-10">
                  <ProjectVisual project={project} eager={index < 2} className="w-full" />
                </div>
                <div className="flex-1 p-6 sm:p-10">
                  <p className="label-caps text-brand-300">{project.type}</p>
                  <h3 className="type-h3 mt-4">{project.name}</h3>
                  <p className="mt-3 max-w-lg text-muted">{project.description}</p>
                  <ProjectLink project={project} className="mt-7" />
                </div>
              </SpotlightCard>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand title="Want your business *on this page?*" />
    </>
  );
}
