"use client";

import { useState } from "react";
import CreateProjectApproach from "./CreateProjectApproach";
import ProjectApproachList from "./ProjectApproachList";



interface ProjectApproachProps {
  projectId: string;
  isAdmin?: boolean;
}

export default function ProjectApproach({
  projectId,
  isAdmin = false,
}: ProjectApproachProps) {
  const [
    projectApproachListReload,
    setProjectApproachListReload,
  ] = useState(0);

  const handleProjectApproachChanged = () => {
    setProjectApproachListReload(
      (value) => value + 1,
    );
  };

  return (
    <div
      className="
        rounded-3xl border border-white/20
        bg-white/5 p-6
        shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        backdrop-blur-xs
      "
    >
      <div className="mb-6">
        <h2 className="text-lg font-medium text-white">
          Project Approach
        </h2>

        <p className="mt-1 text-sm text-white/40">
          Manage the approach and implementation details
          of this project.
        </p>
      </div>

      {isAdmin && (
        <CreateProjectApproach
          projectId={projectId}
          onCreated={
            handleProjectApproachChanged
          }
        />
      )}

      <div className={isAdmin ? "mt-6" : ""}>
        <ProjectApproachList
          projectId={projectId}
          isAdmin={isAdmin}
          projectApproachListReload={
            projectApproachListReload
          }
          onChanged={
            handleProjectApproachChanged
          }
        />
      </div>
    </div>
  );
}