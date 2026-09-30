"use client";

import Image from "next/image";

import WorkSectorAction from "./WorkSectorAction";

export interface WorkSectorData {
  id: string;
  aboutMeId: string;
  sectorImg: string;
  sectorName: string;
  sectorDetail: string;
  sortOrder: number;
  isActive: boolean;
}

interface EachWorkSectorCardProps {
  sector: WorkSectorData;
  onChanged?: () => void;
  isAdmin?: boolean;
}

export default function EachWorkSectorCard({
  sector,
  onChanged,
  isAdmin = false,
}: EachWorkSectorCardProps) {
  return (
    <div
      className="
        rounded-2xl border border-white/10
        bg-white/[0.03] p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className="
              overflow-hidden rounded-xl
              border border-white/10
            "
          >
            <Image
              src={sector.sectorImg}
              alt={sector.sectorName}
              width={64}
              height={64}
              className="h-16 w-16 object-cover"
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-white">
              {sector.sectorName}
            </h3>

            {isAdmin && (
              <p className="mt-1 text-xs text-white/40">
                Sort order: {sector.sortOrder}
              </p>
            )}
          </div>
        </div>

        {isAdmin && onChanged && (
          <WorkSectorAction
            sectorId={sector.id}
            onChanged={onChanged}
          />
        )}
      </div>

      <p className="mt-4 text-sm leading-6 text-white/50">
        {sector.sectorDetail}
      </p>

      {isAdmin && (
        <div className="mt-4">
          <span
            className={`
              inline-flex rounded-full
              border px-3 py-1
              text-xs
              ${
                sector.isActive
                  ? "border-green-400/20 bg-green-500/10 text-green-300"
                  : "border-white/10 bg-white/5 text-white/40"
              }
            `}
          >
            {sector.isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>
      )}
    </div>
  );
}