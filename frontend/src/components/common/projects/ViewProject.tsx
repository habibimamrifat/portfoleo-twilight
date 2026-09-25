"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import Card from "@/components/common/util/Card";
import { getApi } from "@/api/getapi";

import WriteProjectComment from "@/components/common/projects/WriteProjectComment";
import ProjectCommentList from "@/components/common/projects/ProjectComment";

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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

interface ViewProjectProps {
  projectId: string;
  isAdmin?: boolean;
}

export default function ViewProject({
  projectId,
  isAdmin = false,
}: ViewProjectProps) {
  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getApi(
          `/projects/${projectId}`,
          isAdmin,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to load project.",
          );
        }

        const projectData =
          result?.data ?? result;

        if (cancelled) {
          return;
        }

        setProject(projectData);
      } catch (error) {
        console.error(
          "Failed to fetch project:",
          error,
        );

        if (cancelled) {
          return;
        }

        setProject(null);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load project.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchProject();

    return () => {
      cancelled = true;
    };
  }, [projectId, isAdmin]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="flex items-center gap-3 text-sm text-white/50">
          <Loader2
            size={18}
            className="animate-spin"
          />

          <span>
            Loading project...
          </span>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <Card className="w-full max-w-lg p-8 text-center">
          <h1 className="text-xl font-semibold text-white">
            Project not found
          </h1>

          <p className="mt-3 text-sm text-white/40">
            {error ||
              "The project you're looking for doesn't exist."}
          </p>

          <Link
            href={
              isAdmin
                ? "/dashboard/projects"
                : "/portfolio/projects"
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} />

            Back to Projects
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Back to Projects */}
        <Link
          href={
            isAdmin
              ? "/dashboard/projects"
              : "/portfolio/projects"
          }
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />

          Back to Projects
        </Link>

        {/* Project Header */}
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            {project.platform}
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white lg:text-5xl">
            {project.name}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-white/50">
            {project.description}
          </p>
        </div>

        {/* Project Images */}
        {project.images?.length > 0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {project.images.map(
              (image, index) => (
                <Card
                  key={`${image}-${index}`}
                  className="overflow-hidden p-0"
                >
                  <div className="relative aspect-video w-full">
                    <Image
                      src={image}
                      alt={`${project.name} image ${
                        index + 1
                      }`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </Card>
              ),
            )}
          </div>
        )}

        {/* Project Information */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Card className="p-6">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Platform
            </p>

            <p className="mt-2 text-sm text-white/70">
              {project.platform}
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Status
            </p>

            <p className="mt-2 text-sm text-white/70">
              {project.status}
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Project
            </p>

            <p className="mt-2 text-sm text-white/70">
              {project.featured
                ? "Featured"
                : "Project"}
            </p>
          </Card>
        </div>

        {/* Approach */}
        {project.approachTaken && (
          <Card className="mt-8 p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-400">
              Approach
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              How I approached the project
            </h2>

            <p className="mt-5 max-w-4xl whitespace-pre-wrap text-sm leading-7 text-white/50">
              {project.approachTaken}
            </p>
          </Card>
        )}

        {/* Links */}
        {(project.liveLink ||
          project.githubLink) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm text-white transition hover:bg-white/20"
              >
                <ExternalLink size={16} />

                Live Project
              </a>
            )}

            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <FaGithub size={16} />

                GitHub
              </a>
            )}
          </div>
        )}

        {/* Project Comments */}
        <ProjectCommentList
          projectId={project.id}
          isAdmin={isAdmin}
        />

        {/* Write Project Comment */}
        {!isAdmin && (
          <WriteProjectComment
            projectId={project.id}
          />
        )}
      </div>
    </main>
  );
}