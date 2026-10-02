"use client";

import Image from "next/image";
import Card from "../../util/Card";
import ProjectApproachActions from "./ProjectApproachActions";



export interface ProjectApproachData {
  id: string;
  projectId: string;
  approachImg: string | null;
  approachTitle: string;
  detail: string[];
  sortOrder: number;
  isActive: boolean;
}

interface EachProjectApproachCardProps {
  approach: ProjectApproachData;
  projectId: string;
  isAdmin?: boolean;
  onChanged?: () => void;
}

export default function EachProjectApproachCard({
  approach,
  projectId,
  isAdmin = false,
  onChanged,
}: EachProjectApproachCardProps) {
  return (
    <Card className="w-full p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {approach.approachImg && (
            <div
              className="
                overflow-hidden
                rounded-xl
                border border-white/10
              "
            >
              <Image
                src={approach.approachImg}
                alt={approach.approachTitle}
                width={64}
                height={64}
                className="
                  h-16 w-16
                  object-cover
                "
              />
            </div>
          )}

          <div className="min-w-0">
            <h3 className="text-sm font-medium text-white">
              {approach.approachTitle}
            </h3>

            {isAdmin && (
              <p className="mt-1 text-xs text-white/40">
                Sort order:{" "}
                {approach.sortOrder}
              </p>
            )}
          </div>
        </div>

        {isAdmin && onChanged && (
          <ProjectApproachActions
            projectId={projectId}
            approachId={approach.id}
            approach={approach}
            isAdmin={isAdmin}
            onChanged={onChanged}
          />
        )}
      </div>

      <div className="mt-5 space-y-2">
        {approach.detail.map(
          (detail, index) => (
            <p
              key={`${approach.id}-detail-${index}`}
              className="
                text-sm
                leading-6
                text-white/50
              "
            >
              {detail}
            </p>
          ),
        )}
      </div>

      {isAdmin && (
        <div className="mt-4">
          <span
            className={`
              inline-flex
              rounded-full
              border px-3 py-1
              text-xs
              ${
                approach.isActive
                  ? "border-green-400/20 bg-green-500/10 text-green-300"
                  : "border-white/10 bg-white/5 text-white/40"
              }
            `}
          >
            {approach.isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>
      )}
    </Card>
  );
}