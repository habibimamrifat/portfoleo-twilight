"use client";

import Card from "../common/Card";
import {
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import {
  FaGithub,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Project = {
  id: string;
  name: string;
  description: string;
  images: string[];
  liveLink?: string | null;
  githubLink?: string | null;
  status: string;
  platform: string;
  approachTaken?: string | null;
  featured: boolean;
  sortOrder: number;
};

const defaultProjects: Project[] = [
  {
    id: "bachelor-united",
    name: "Bachelor United",
    description:
      "A modular marketplace and community platform designed around scalable backend architecture.",
    images: [],
    liveLink: null,
    githubLink: null,
    status: "IN_PROGRESS",
    platform: "WEBSITE",
    approachTaken: null,
    featured: true,
    sortOrder: 1,
  },
  {
    id: "mini-kanban",
    name: "Mini Kanban",
    description:
      "A project management application with boards, workflow states, tasks and member management.",
    images: [],
    liveLink: null,
    githubLink: null,
    status: "DEVELOPED",
    platform: "WEBSITE",
    approachTaken: null,
    featured: false,
    sortOrder: 2,
  },
  {
    id: "portfolio-platform",
    name: "Portfolio Platform",
    description:
      "A professional developer portfolio designed to evolve into a dynamic content management system.",
    images: [],
    liveLink: null,
    githubLink: null,
    status: "IN_PROGRESS",
    platform: "WEBSITE",
    approachTaken: null,
    featured: false,
    sortOrder: 3,
  },
];

export default function Projects() {
  const [projects, setProjects] =
    useState<Project[]>(defaultProjects);

  useEffect(() => {
    async function getProjects() {
      try {
        const response = await fetch(
          `${BASE_URL}/projects`,
        );

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        if (
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          setProjects(result.data);
        }
      } catch {
        setProjects(defaultProjects);
      }
    }

    getProjects();
  }, []);

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
            Things I've built.
          </h2>
        </div>

        {/* Projects */}
        <div className="grid gap-5">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="p-7 transition duration-300 hover:bg-white/10"
            >
              <div className="flex flex-col justify-between gap-5 sm:flex-row">
                {/* Project Information */}
                <div>
                  <h3 className="text-xl font-semibold">
                    {project.name}
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
                    {project.description}
                  </p>

                  {/* Status / Platform */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
                      {project.platform}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* GitHub */}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name} GitHub`}
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/10
                        bg-white/5
                        transition
                        hover:bg-white/10
                      "
                    >
                      <FaGithub size={16} />
                    </a>
                  )}

                  {/* Live Project */}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name} live project`}
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/10
                        bg-white/5
                        transition
                        hover:bg-white/10
                      "
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {/* View More */}
                  <a
                    href={`/projects/${project.id}`}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      px-4
                      py-2
                      text-sm
                      text-white/70
                      transition
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    View More
                    <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}