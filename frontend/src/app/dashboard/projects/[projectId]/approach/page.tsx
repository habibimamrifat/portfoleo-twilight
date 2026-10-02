"use client";

import { useEffect, useState } from "react";

import { getApi } from "@/api/getapi";
import ProjectApproach from "@/components/common/projects/projectApproch/ProjectApproach";

interface ProjectApproachPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

interface Project {
  id: string;
  name: string;
}

interface ProjectApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Project;
  path: string;
  timestamp: string;
}

export default function ProjectApproachPage({
  params,
}: ProjectApproachPageProps) {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      const { projectId } = await params;

      const response = await getApi(
        `/projects/${projectId}`,
      );

      const result: ProjectApiResponse =
        await response.json();

      console.log("Project data:=====>>>>", result);

      setProject(result.data);
    };

    loadProject();
  }, [params]);

  if (!project) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-white/40">
        Loading project...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/30">
          Project
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-white">
          {project.name}
        </h1>

        <p className="mt-1 text-sm text-white/40">
          Manage the approach and implementation details
          for this project.
        </p>
      </div>

      <ProjectApproach
        projectId={project.id}
        isAdmin
      />
    </div>
  );
}