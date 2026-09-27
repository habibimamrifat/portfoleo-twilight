"use client";

import { Edit3 } from "lucide-react";
import { useState } from "react";

import DeleteProject from "./DeleteProject";
import EditProject from "./EditProject";

interface ProjectActionsProps {
  projectId: string;
  refreshParent: () => void;
}

export default function ProjectActions({
  projectId,
  refreshParent,
}: ProjectActionsProps) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <EditProject
        projectId={projectId}
        refreshParent={refreshParent}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="flex shrink-0 gap-2">
      {/* EDIT */}

      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
        title="Edit Project"
      >
        <Edit3
          size={16}
          strokeWidth={1.6}
        />
      </button>

      {/* DELETE */}

      <DeleteProject
        projectId={projectId}
        refreshParent={refreshParent}
      />
    </div>
  );
}