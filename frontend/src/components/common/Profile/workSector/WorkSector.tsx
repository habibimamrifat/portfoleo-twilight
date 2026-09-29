"use client";

import { Suspense, use } from "react";

import { Loader2 } from "lucide-react";

import { getApi } from "@/api/getapi";

import WorkSectorCreate from "./WorkSectorCreate";
import WorkSectorUpdate from "./WorkSectorUpdate";

interface WorkSectorData {
  id: string;
  aboutMeId: string;
  sectorImg: string;
  sectorName: string;
  sectorDetail: string;
  sortOrder: number;
  isActive: boolean;
}

const workSectorPromise = getWorkSectors();

async function getWorkSectors(): Promise<WorkSectorData[]> {
  try {
    const response = await getApi(
      "/about-me/sectors",
      true,
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to load Work Sectors",
      );
    }

    return result.data ?? result;
  } catch {
    return [];
  }
}

export default function WorkSector() {
  return (
    <Suspense
      fallback={
        <div
          className="
            flex min-h-[250px]
            items-center justify-center
            rounded-3xl border border-white/20
            bg-white/5
            backdrop-blur-xs
          "
        >
          <Loader2
            size={28}
            className="animate-spin text-white/60"
          />
        </div>
      }
    >
      <WorkSectorContent />
    </Suspense>
  );
}

function WorkSectorContent() {
  const workSectors = use(
    workSectorPromise,
  );

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

      <WorkSectorCreate
        onCreated={() => {
          window.location.reload();
        }}
      />

      <div className="mt-6 space-y-4">
        {workSectors.length === 0 ? (
          <div
            className="
              rounded-2xl border border-white/10
              bg-white/[0.03]
              px-4 py-6
              text-center text-sm text-white/40
            "
          >
            No work sectors added yet.
          </div>
        ) : (
          workSectors.map((sector) => (
            <WorkSectorUpdate
              key={sector.id}
              sector={sector}
              onUpdated={() => {
                window.location.reload();
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}