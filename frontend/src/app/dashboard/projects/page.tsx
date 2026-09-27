"use client";

import { useState } from "react";
import {
  ArrowLeft,
  FolderKanban,
  Plus,
  X,
} from "lucide-react";

import Card from "@/components/common/util/Card";
import ProjectList from "@/components/common/projects/ProjectList";
import ProjectForm from "@/components/common/projects/ProjectForm";

export default function ProjectsPage() {
  const [showForm, setShowForm] =
    useState(false);

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
            <FolderKanban
              size={21}
              className="text-white"
              strokeWidth={1.7}
            />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-white">
              Projects
            </h1>

            <p className="text-sm text-white/45">
              Manage your portfolio projects.
            </p>
          </div>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() =>
              setShowForm(true)
            }
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
          >
            <Plus
              size={17}
              strokeWidth={1.8}
            />

            Add Project
          </button>
        )}
      </div>

      {/* PROJECT LIST */}

      {!showForm && (
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              Projects
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Manage all projects in your
              portfolio.
            </p>
          </div>

          <ProjectList isAdmin={true} />
        </Card>
      )}

      {/* CREATE PROJECT */}

      {showForm && (
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Create Project
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Add a new project to your
                portfolio.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowForm(false)
              }
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>

          <ProjectForm
            onSuccess={() =>
              setShowForm(false)
            }
            onCancel={() =>
              setShowForm(false)
            }
          />
        </Card>
      )}
    </div>
  );
}