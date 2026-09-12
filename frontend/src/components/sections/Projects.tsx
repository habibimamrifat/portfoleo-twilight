"use client";

import Card from "../common/Card";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Bachelor United",
    description:
      "A modular marketplace and community platform designed around scalable backend architecture.",
    technologies: ["Next.js", "NestJS", "PostgreSQL"],
  },
  {
    title: "Mini Kanban",
    description:
      "A project management application with boards, workflow states, tasks and member management.",
    technologies: ["Next.js", "NestJS", "Prisma"],
  },
  {
    title: "Portfolio Platform",
    description:
      "A professional developer portfolio designed to evolve into a dynamic content management system.",
    technologies: ["Next.js", "TypeScript", "Tailwind"],
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Projects
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Things I've built.
          </h2>
        </div>

        <div className="grid gap-5">
          {projects.map((project) => (
            <Card
              key={project.title}
              className="p-7 transition duration-300 hover:bg-white/10"
            >
              <div className="flex flex-col justify-between gap-5 sm:flex-row">
                <div>
                  <h3 className="text-xl font-semibold">
                    {project.title}
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10">
                    {/* <Github size={16} /> */}
                  </button>

                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}