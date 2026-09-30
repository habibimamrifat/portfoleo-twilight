"use client";


import WorkSectorCreate from "./WorkSectorCreate";
import WorkSectorList from "./WorkSectorList";

export default function WorkSector() {
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
          Work Sectors
        </h2>

        <p className="mt-1 text-sm text-white/40">
          Manage the areas and industries you work with.
        </p>
      </div>

      <WorkSectorCreate />

      <div className="mt-6">
        <WorkSectorList isAdmin />
      </div>
    </div>
  );
}