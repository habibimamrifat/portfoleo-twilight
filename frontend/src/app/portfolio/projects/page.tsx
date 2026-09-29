"use client";

import ProjectList from "@/components/common/projects/ProjectList";

export default function ProjectsPage() {
  return (
    <section
      id="projects"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        {/* Heading */}
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Projects
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Things I have built.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            A collection of projects I have worked on, from full-stack
            applications to backend systems and business platforms.
          </p>
        </div>

        {/* All Projects */}
        <ProjectList />
      </div>
    </section>
  );
}