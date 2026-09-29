"use client";

import Image from "next/image";
import { useState } from "react";
import { BriefcaseBusiness, Pencil } from "lucide-react";

import Card from "@/components/common/util/Card";

import ExperienceViewButton from "./ExperienceViewButton";
import ExperienceDelete from "./ExperienceDelete";
import ExperienceEdit from "./ExperienceEdit";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE"
  | "TEMPORARY"
  | "OTHER";

export interface Experience {
  id: string;
  organization: string;
  role: string;
  responsibilities: string;
  learned?: string | null;
  location?: string | null;
  images: string[];
  employmentType: EmploymentType | string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  experienceLetterUrl?: string | null;
  sortOrder: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface EachExperienceCardProps {
  experience: Experience;
  isAdmin?: boolean;
  reloadList?: () => void | Promise<void>;
}

function formatPeriod(
  startDate: string,
  endDate: string | null | undefined,
  isCurrent: boolean,
) {
  const start = new Date(startDate);
  const startYear = start.getFullYear();

  if (isCurrent || !endDate) {
    return `${startYear} — Present`;
  }

  const end = new Date(endDate);

  return `${startYear} — ${end.getFullYear()}`;
}

function getWordsPreview(
  text: string | null | undefined,
  maxWords = 200,
) {
  if (!text) {
    return "";
  }

  const trimmedText = text.trim();

  if (!trimmedText) {
    return "";
  }

  const words = trimmedText.split(/\s+/);

  if (words.length <= maxWords) {
    return trimmedText;
  }

  return `${words.slice(0, maxWords).join(" ")}...`;
}

function getImageUrl(image?: string | null) {
  if (!image) {
    return null;
  }

  const trimmed = image.trim();

  if (!trimmed) {
    return null;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/${trimmed}`;
}

export default function EachExperienceCard({
  experience,
  isAdmin = false,
  reloadList,
}: EachExperienceCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const imageUrl = getImageUrl(
    experience.images?.[0],
  );

  const handleEdit = () => {
    if (!isAdmin) {
      return;
    }

    setIsEditOpen(true);
  };

  const handleReloadList = async () => {
    setIsEditOpen(false);
    await reloadList?.();
  };

  const handleCancelEdit = () => {
    setIsEditOpen(false);
  };

  if (isEditOpen) {
    return (
      <ExperienceEdit
        experienceId={experience.id}
        reloadList={handleReloadList}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <Card className="group flex h-full min-h-[560px] flex-col overflow-hidden">
      <div className="relative min-h-[280px] w-full flex-1 overflow-hidden bg-white/5">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${experience.organization} - ${experience.role}`}
            fill
            unoptimized
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <BriefcaseBusiness
                  size={27}
                  strokeWidth={1.5}
                  className="text-white/25"
                />
              </div>

              <span className="text-xs text-white/25">
                No Image
              </span>
            </div>
          </div>
        )}

        {experience.isCurrent && (
          <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md">
            Current
          </div>
        )}

        <div className="absolute right-4 top-4 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/60 backdrop-blur-md">
          {experience.employmentType.replace(
            /_/g,
            " ",
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-7">
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/30">
          {experience.organization}
        </span>

        <h3 className="mt-3 line-clamp-2 text-2xl font-semibold leading-tight text-white">
          {experience.role}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/35">
          <span>
            {formatPeriod(
              experience.startDate,
              experience.endDate,
              experience.isCurrent,
            )}
          </span>

          {experience.location && (
            <>
              <span className="text-white/15">
                •
              </span>

              <span>
                {experience.location}
              </span>
            </>
          )}
        </div>

        <p className="mt-4 line-clamp-5 text-sm leading-7 text-white/45">
          {experience.responsibilities}
        </p>

        {experience.learned && (
          <div className="mt-4">
            <p className="line-clamp-2 text-sm leading-6 text-white/35">
              {getWordsPreview(
                experience.learned,
                200,
              )}
            </p>
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
          <ExperienceViewButton
            experienceId={experience.id}
            isAdmin={isAdmin}
          />

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={handleEdit}
                className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white/50 transition hover:bg-white/10 hover:text-white"
                title="Edit experience"
              >
                <Pencil
                  size={16}
                  strokeWidth={1.6}
                />

                <span className="hidden sm:inline">
                  Edit
                </span>
              </button>

              <ExperienceDelete
                experienceId={experience.id}
                reloadList={handleReloadList}
              />
            </>
          )}
        </div>
      </div>
    </Card>
  );
}