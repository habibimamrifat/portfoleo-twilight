"use client";

import Link from "next/link";
import ProjectList from "@/components/common/projects/ProjectList";

export default function Projects() {
  return (
    <section
      id="projects"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        {/* Heading */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
              Projects
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Things I have built.
            </h2>
          </div>

          {/* See All */}
          <Link
            href="/portfolio/projects"
            className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            See All
          </Link>
        </div>

        {/* Projects */}
        <ProjectList isPortfolio />
      </div>
    </section>
  );
}