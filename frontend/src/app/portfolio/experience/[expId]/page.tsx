"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Loader2,
  MapPin,
} from "lucide-react";

import Card from "@/components/common/util/Card";
import { getApi } from "@/api/getapi";
import ImageSwiper from "@/components/common/slider/ThumbsGalary";

type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE"
  | "TEMPORARY"
  | "OTHER";

interface Experience {
  id: string;
  organization: string;
  role: string;
  responsibilities: string;
  learned?: string | null;
  location?: string | null;
  images: string[];
  employmentType: EmploymentType;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  experienceLetterUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ExperiencePageProps {
  params: Promise<{
    expId: string;
  }>;
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

export default function ExperiencePage({
  params,
}: ExperiencePageProps) {
  const { expId } = use(params);

  const [experience, setExperience] =
    useState<Experience | null>(null);

  const [loading, setLoading] =
    useState(Boolean(expId));

  const [error, setError] =
    useState<string | null>(
      expId
        ? null
        : "Experience could not be identified.",
    );

  useEffect(() => {
    if (!expId) {
      return;
    }

    let cancelled = false;

    const fetchExperience = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getApi(
          `/experiences/${expId}`,
          true,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to fetch experience.",
          );
        }

        const rawExperience =
          result?.data?.data ??
          result?.data ??
          result;

        if (
          !rawExperience ||
          typeof rawExperience !== "object"
        ) {
          throw new Error(
            "Invalid experience response.",
          );
        }

        if (cancelled) {
          return;
        }

        setExperience(
          rawExperience as Experience,
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to fetch experience:",
          error,
        );

        setExperience(null);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch experience.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchExperience();

    return () => {
      cancelled = true;
    };
  }, [expId]);

  if (!expId) {
    return (
      <main className="min-h-screen px-6 py-16 lg:px-10">
        <div className="flex min-h-[70vh] items-center justify-center">
          <Card className="w-full max-w-lg p-8 text-center">
            <BriefcaseBusiness
              size={32}
              strokeWidth={1.5}
              className="mx-auto mb-3 text-white/20"
            />

            <h1 className="text-xl font-semibold text-white">
              Experience not found
            </h1>

            <p className="mt-3 text-sm text-white/40">
              Experience could not be identified.
            </p>

            <Link
              href="/portfolio#experience"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Experience
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-16 lg:px-10">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-white/50">
            <Loader2
              size={20}
              className="animate-spin"
            />

            <span>Loading experience...</span>
          </div>
        </div>
      </main>
    );
  }

  if (error || !experience) {
    return (
      <main className="min-h-screen px-6 py-16 lg:px-10">
        <div className="flex min-h-[70vh] items-center justify-center">
          <Card className="w-full max-w-lg p-8 text-center">
            <BriefcaseBusiness
              size={32}
              strokeWidth={1.5}
              className="mx-auto mb-3 text-white/20"
            />

            <h1 className="text-xl font-semibold text-white">
              Experience not found
            </h1>

            <p className="mt-3 text-sm text-white/40">
              {error ||
                "Unable to load this experience."}
            </p>

            <Link
              href="/portfolio#experience"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Experience
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  const formattedStartDate = new Date(
    experience.startDate,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const formattedEndDate = experience.endDate
    ? new Date(
        experience.endDate,
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "Present";

  const images = Array.isArray(experience.images)
    ? experience.images
        .map((image) => getImageUrl(image))
        .filter(
          (image): image is string =>
            Boolean(image),
        )
    : [];

  return (
    <main className="h-screen overflow-scroll px-6 py-16 lg:px-10">
      <article className="mx-auto max-w-4xl">
        {/* BACK */}

        <Link
          href="/portfolio#experience"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Experience
        </Link>

        {/* EXPERIENCE HEADER */}

        <Card className="overflow-hidden p-0">
          {/* IMAGES */}

          {images.length > 0 && (
            <ImageSwiper
              images={images}
              alt={`${experience.organization} - ${experience.role}`}
            />
          )}

          {/* HEADER CONTENT */}

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                    {experience.employmentType.replace(
                      /_/g,
                      " ",
                    )}
                  </span>

                  {experience.isCurrent && (
                    <span className="rounded-lg border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-300">
                      Current
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {experience.role}
                </h1>

                <p className="mt-3 text-lg text-white/55">
                  {experience.organization}
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <BriefcaseBusiness
                  size={22}
                  className="text-white/50"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* META */}

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/10 pt-5 text-sm text-white/35">
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={16}
                  strokeWidth={1.6}
                />

                <span>
                  {formattedStartDate} —{" "}
                  {formattedEndDate}
                </span>
              </div>

              {experience.location && (
                <div className="flex items-center gap-2">
                  <MapPin
                    size={16}
                    strokeWidth={1.6}
                  />

                  <span>
                    {experience.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* RESPONSIBILITIES */}

        <Card className="mt-6 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <FileText
              size={19}
              className="text-white/50"
              strokeWidth={1.6}
            />

            <h2 className="text-xl font-semibold text-white">
              Responsibilities
            </h2>
          </div>

          <div className="mt-5 whitespace-pre-wrap break-words text-sm leading-8 text-white/70 sm:text-base">
            {experience.responsibilities}
          </div>
        </Card>

        {/* LEARNED */}

        {experience.learned && (
          <Card className="mt-6 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white">
              What I Learned
            </h2>

            <div className="mt-5 whitespace-pre-wrap break-words text-sm leading-8 text-white/70 sm:text-base">
              {experience.learned}
            </div>
          </Card>
        )}
      </article>
    </main>
  );
}