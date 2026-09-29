"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import ExperienceCreate from "@/components/common/experience/ExperienceCreate";
import ExperienceList from "@/components/common/experience/ExperienceList";

export default function ExperiencesDashboardPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <section className="relative space-y-6 px-6 py-20 lg:px-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Experience
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Manage professional experience.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            Add, edit, view and manage your professional experience
            entries.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <Plus size={18} strokeWidth={1.7} />
          <span>Create Experience</span>
        </button>
      </div>

      <ExperienceList isAdmin />

      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md">
          <div className="relative flex h-full max-h-[calc(100vh-48px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="absolute right-4 top-4 z-[110] flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/60 text-white/60 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
              title="Close"
            >
              <X size={20} strokeWidth={1.7} />
            </button>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <ExperienceCreate />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}