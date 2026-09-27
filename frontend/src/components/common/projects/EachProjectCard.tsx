"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Edit3,
  Trash2,
} from "lucide-react";

import Card from "@/components/common/util/Card";

import type { Project } from "./ProjectList";

interface ProjectCardProps {
  project: Project;
  isAdmin?: boolean;
  onDeleted?: () => void;
}

export default function ProjectCard({
  project,
  isAdmin = false,
  onDeleted,
}: ProjectCardProps) {
  const image =
    project.images?.length > 0
      ? project.images[0]
      : null;

  const handleDelete = async () => {
    /*
     * Delete functionality will be connected
     * when we create the project actions.
     */
    console.log("Delete project:", project.id);

    onDeleted?.();
  };

  return (
    <Card className="group flex min-h-[560px] h-full flex-col overflow-hidden">
      {/* Project Image */}
      <div className="relative min-h-[280px] w-full flex-1 overflow-hidden bg-white/5">
        {image ? (
          <Image
            src={image}
            alt={project.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-white/20">
            No Image
          </div>
        )}

        {/* Featured */}
        {project.featured && (
          <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md">
            Featured
          </div>
        )}

        {/* Status */}
        <div className="absolute right-4 top-4 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/60 backdrop-blur-md">
          {project.status}
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col p-7">
        {/* Platform */}
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/30">
          {project.platform}
        </span>

        {/* Name */}
        <h3 className="mt-3 line-clamp-2 text-2xl font-semibold leading-tight text-white">
          {project.name}
        </h3>

        {/* Description */}
        <p className="mt-4 line-clamp-5 text-sm leading-7 text-white/45">
          {project.description}
        </p>

        {/* Actions */}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
          {/* View */}
          <Link
            href={
              isAdmin
                ? `/dashboard/projects/${project.id}`
                : `/portfolio/projects/${project.id}`
            }
            className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white/55 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowUpRight
              size={17}
              strokeWidth={1.6}
            />

            <span>View More</span>
          </Link>

          {/* Admin Actions */}
          {isAdmin && (
            <>
              <Link
                href={`/dashboard/projects/${project.id}/edit`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
                title="Edit project"
              >
                <Edit3
                  size={17}
                  strokeWidth={1.6}
                />
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/10 bg-red-500/5 text-red-300/60 transition hover:bg-red-500/10 hover:text-red-300"
                title="Delete project"
              >
                <Trash2
                  size={17}
                  strokeWidth={1.6}
                />
              </button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}