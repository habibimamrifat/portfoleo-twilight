"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  ExternalLink,
  FileText,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import Card from "@/components/common/util/Card";
import { getApi } from "@/api/getapi";
import ProjectCommentList from "./comments/ProjectCommentList";
import ImageSwiper from "../slider/ThumbsGalary";
import Appear from "@/components/common/animation/Appear";
import ProjectApproachList from "./projectApproch/ProjectApproachList";


type ProjectStatus =
  | "IN_PROGRESS"
  | "DEVELOPED"
  | "DISCONTINUED";

interface Project {
  id: string;
  name: string;
  description: string;
  images: string[];
  liveLink?: string | null;
  githubLink?: string | null;
  status: ProjectStatus;
  platform: string;
  featured: boolean;
  sortOrder: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ViewProjectProps {
  projectId: string;
  isAdmin?: boolean;
}

const getImageUrl = (
  image?: string | null,
): string | null => {
  if (!image) {
    return null;
  }

  const trimmed = image.trim();

  if (!trimmed) {
    return null;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/${trimmed}`;
};

export default function ViewProject({
  projectId,
  isAdmin = false,
}: ViewProjectProps) {
  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] =
    useState(Boolean(projectId));

  const [error, setError] =
    useState<string | null>(
      projectId
        ? null
        : "Project could not be identified.",
    );

  /* =========================================================
     FETCH PROJECT
     ========================================================= */

  useEffect(() => {
    if (!projectId) {
      return;
    }

    let cancelled = false;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getApi(
          `/projects/${projectId}`,
          isAdmin,
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to fetch project.",
          );
        }

        const rawProject =
          result?.data?.data ??
          result?.data ??
          result;

        if (
          !rawProject ||
          typeof rawProject !== "object"
        ) {
          throw new Error(
            "Invalid project response.",
          );
        }

        if (cancelled) {
          return;
        }

        setProject(rawProject as Project);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to fetch project:",
          error,
        );

        setProject(null);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch project.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProject();

    return () => {
      cancelled = true;
    };
  }, [projectId, isAdmin]);

  /* =========================================================
     INVALID PROJECT ID
     ========================================================= */

  if (!projectId) {
    return (
      <Appear
        direction="none"
        delay={0}
        duration={0.5}
      >
        <Card className="flex flex-col items-center justify-center p-10 text-center">
          <FileText
            size={32}
            strokeWidth={1.5}
            className="mb-3 text-white/20"
          />

          <p className="text-sm text-white/50">
            Project could not be identified.
          </p>
        </Card>
      </Appear>
    );
  }

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-sm text-white/40">
          <Loader2
            size={17}
            className="animate-spin"
          />

          Loading project...
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error || !project) {
    return (
      <Appear
        direction="none"
        delay={0}
        duration={0.5}
      >
        <Card className="flex flex-col items-center justify-center p-10 text-center">
          <FileText
            size={32}
            strokeWidth={1.5}
            className="mb-3 text-white/20"
          />

          <p className="text-sm text-white/50">
            {error || "Project not found."}
          </p>
        </Card>
      </Appear>
    );
  }

  /* =========================================================
     PROJECT DATA
     ========================================================= */

  const formattedDate = new Date(
    project.createdAt,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const images = Array.isArray(project.images)
    ? project.images
        .map((image) => getImageUrl(image))
        .filter(
          (image): image is string =>
            Boolean(image),
        )
    : [];

  /* =========================================================
     RENDER PROJECT
     ========================================================= */

  return (
    <article className="space-y-6">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <Appear
        direction="bottom"
        delay={0}
        duration={0.6}
      >
        <Card className="overflow-hidden">
          {/* PROJECT IMAGES */}

          {images.length > 0 && (
            <ImageSwiper
              images={images}
              alt={project.name}
            />
          )}

          {/* PROJECT HEADER */}

          <div className="p-6 md:p-8">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                {project.platform}
              </span>

              <span
                className={`rounded-lg border px-3 py-1 text-xs font-medium ${
                  project.status === "DEVELOPED"
                    ? "border-green-400/20 bg-green-500/10 text-green-300"
                    : project.status ===
                        "DISCONTINUED"
                      ? "border-red-400/20 bg-red-500/10 text-red-300"
                      : "border-yellow-400/20 bg-yellow-500/10 text-yellow-300"
                }`}
              >
                {project.status}
              </span>

              {project.featured && (
                <span className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                  Featured
                </span>
              )}
            </div>

            <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-white md:text-4xl">
              {project.name}
            </h1>

            <p className="mt-4 max-w-4xl text-base leading-7 text-white/50 md:text-lg">
              {project.description}
            </p>

            {/* LINKS */}

            {(project.liveLink ||
              project.githubLink) && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
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
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <FaGithub size={16} />

                    GitHub
                  </a>
                )}
              </div>
            )}

            {/* META */}

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-5 text-sm text-white/35">
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={16}
                  strokeWidth={1.6}
                />

                <span>{formattedDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <FileText
                  size={16}
                  strokeWidth={1.6}
                />

                <span>{project.platform}</span>
              </div>
            </div>
          </div>
        </Card>
      </Appear>

      {/* =====================================================
          PROJECT APPROACH
          ===================================================== */}

          <h3 className="text-2xl text-white mt-20 font-bold">
            <div className="flex items-center gap-2">
              <Lightbulb size={24} />
              Project Approach Taken
            </div>
          </h3>

      <Appear
        direction="bottom"
        delay={0.15}
        duration={0.6}
      >
        <ProjectApproachList
          projectId={project.id}
          isAdmin={isAdmin}
          projectApproachListReload={0}
        />
      </Appear>

      {/* =====================================================
          COMMENTS
          ===================================================== */}

      <Appear
        direction="bottom"
        delay={0.3}
        duration={0.6}
      >
        <ProjectCommentList
          projectId={project.id}
          isAdmin={isAdmin}
        />
      </Appear>
    </article>
  );
}