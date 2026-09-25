"use client";

import ProjectList from "@/components/common/projects/ProjectList";

export default function Projects() {
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

          <h2 className="mt-2 text-3xl font-bold">
            Things I have built.
          </h2>
        </div>

        {/* Projects */}
        <ProjectList />
      </div>
    </section>
  );
}