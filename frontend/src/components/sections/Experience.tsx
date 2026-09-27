"use client";

import Image from "next/image";
import Card from "../common/util/Card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BriefcaseBusiness,
} from "lucide-react";
import Appear from "../common/animation/Appear";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Experience = {
  id: string;
  organization: string;
  role: string;
  responsibilities: string;
  learned?: string | null;
  location?: string | null;
  images: string[];
  employmentType: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  experienceLetterUrl?: string | null;
  sortOrder: number;
};

const defaultExperiences: Experience[] = [
  {
    id: "current-freelance",
    organization: "Current / Freelance",
    role: "Full-Stack Developer",
    responsibilities:
      "Building full-stack applications with a strong focus on backend development, APIs and scalable architecture.",
    learned: null,
    location: null,
    images: [],
    employmentType: "FULL_TIME",
    startDate: "2025-01-18",
    endDate: null,
    isCurrent: true,
    experienceLetterUrl: null,
    sortOrder: 1,
  },
  {
    id: "team-lead",
    organization: "Previous Organization",
    role: "Team Lead",
    responsibilities:
      "Worked closely with developers, coordinated development tasks and contributed to technical decisions.",
    learned: null,
    location: null,
    images: [],
    employmentType: "FULL_TIME",
    startDate: "2025-01-18",
    endDate: "2026-01-01",
    isCurrent: false,
    experienceLetterUrl: null,
    sortOrder: 2,
  },
  {
    id: "developer",
    organization: "Previous Organization",
    role: "Developer",
    responsibilities:
      "Developed web applications and backend functionality while working with modern JavaScript technologies.",
    learned: null,
    location: null,
    images: [],
    employmentType: "FULL_TIME",
    startDate: "2025-01-18",
    endDate: "2025-12-31",
    isCurrent: false,
    experienceLetterUrl: null,
    sortOrder: 3,
  },
];

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

export default function Experience() {
  const router = useRouter();

  const [experiences, setExperiences] =
    useState<Experience[]>(defaultExperiences);

  useEffect(() => {
    let cancelled = false;

    async function getExperiences() {
      try {
        const response = await fetch(
          `${BASE_URL}/experiences`,
        );

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        const data =
          result?.data?.data ??
          result?.data ??
          result;

        if (
          !cancelled &&
          Array.isArray(data) &&
          data.length > 0
        ) {
          setExperiences(data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch experiences:",
          error,
        );

        if (!cancelled) {
          setExperiences(defaultExperiences);
        }
      }
    }

    getExperiences();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="experience"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        {/* Section Header */}
        <Appear>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
              Experience
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              My professional journey.
            </h2>
          </div>
        </Appear>

        {/* Experience Grid */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          {experiences.map(
            (experience, index) => {
              const imageUrl = getImageUrl(
                experience.images?.[0],
              );

              const isLeftColumn =
                index % 2 === 0;

              return (
                <Appear
                  key={experience.id}
                  direction={
                    isLeftColumn
                      ? "left"
                      : "right"
                  }
                  delay={0}
                >
                  <Card className="group flex min-h-[560px] h-full flex-col overflow-hidden">
                    {/* Experience Image */}
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

                      {/* Current */}
                      {experience.isCurrent && (
                        <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md">
                          Current
                        </div>
                      )}

                      {/* Employment Type */}
                      <div className="absolute right-4 top-4 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/60 backdrop-blur-md">
                        {experience.employmentType.replace(
                          /_/g,
                          " ",
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex min-w-0 flex-1 flex-col p-7">
                      {/* Organization */}
                      <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/30">
                        {experience.organization}
                      </span>

                      {/* Role */}
                      <h3 className="mt-3 line-clamp-2 text-2xl font-semibold leading-tight text-white">
                        {experience.role}
                      </h3>

                      {/* Period + Location */}
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

                      {/* Responsibilities */}
                      <p className="mt-4 line-clamp-5 text-sm leading-7 text-white/45">
                        {
                          experience.responsibilities
                        }
                      </p>

                      {/* Learned */}
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

                      {/* Bottom Action */}
                      <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/portfolio/experience/${experience.id}`,
                            )
                          }
                          className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white/55 transition hover:bg-white/10 hover:text-white"
                        >
                          <ArrowUpRight
                            size={17}
                            strokeWidth={1.6}
                          />

                          <span>
                            View More
                          </span>
                        </button>
                      </div>
                    </div>
                  </Card>
                </Appear>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}