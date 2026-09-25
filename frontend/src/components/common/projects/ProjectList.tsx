"use client";

import { useCallback, useEffect, useState } from "react";
import { FolderKanban, Loader2 } from "lucide-react";

import Card from "@/components/common/util/Card";
import { getApi } from "@/api/getapi";
import ProjectCard from "./EachProjectCard";



export interface Project {
  id: string;
  name: string;
  description: string;
  images: string[];
  liveLink?: string | null;
  githubLink?: string | null;
  status: string;
  platform: string;
  approachTaken?: string | null;
  featured?: boolean;
  sortOrder?: number;
}

interface ProjectListProps {
  isAdmin?: boolean;
}

export default function ProjectList({
  isAdmin = false,
}: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await getApi(
        "/projects",
        isAdmin,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to fetch projects.",
        );
      }

      const data = result?.data ?? result;

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid projects response.",
        );
      }

      setProjects(data);
      setError(null);
    } catch (error) {
      console.error(
        "Failed to fetch projects:",
        error,
      );

      setProjects([]);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch projects.",
      );
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    const loadProjects = async () => {
      await fetchProjects();
    };

    void loadProjects();
  }, [fetchProjects]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-white/40">
          <Loader2
            size={20}
            className="animate-spin"
          />

          <span>Loading projects...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
          <FolderKanban
            size={32}
            strokeWidth={1.4}
            className="text-white/30"
          />

          <h3 className="mt-4 text-lg font-medium text-white">
            Unable to load projects
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void fetchProjects();
            }}
            className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Try Again
          </button>
        </div>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
          <FolderKanban
            size={32}
            strokeWidth={1.4}
            className="text-white/30"
          />

          <h3 className="mt-4 text-lg font-medium text-white">
            No projects found
          </h3>

          <p className="mt-2 text-sm text-white/40">
            {isAdmin
              ? "There are no projects available."
              : "There are no published projects available right now."}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isAdmin={isAdmin}
          onDeleted={fetchProjects}
        />
      ))}
    </div>
  );
}