"use client";

import Card from "../common/Card";
import { useEffect, useState } from "react";

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

export default function Experience() {
  const [experiences, setExperiences] =
    useState<Experience[]>(defaultExperiences);

  useEffect(() => {
    async function getExperiences() {
      try {
        const response = await fetch(
          `${BASE_URL}/experiences`,
        );

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        if (
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          setExperiences(result.data);
        }
      } catch {
        setExperiences(defaultExperiences);
      }
    }

    getExperiences();
  }, []);

  return (
    <section
      id="experience"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Experience
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            My professional journey.
          </h2>
        </div>

        <div className="space-y-4">
          {experiences.map((experience) => (
            <Card
              key={experience.id}
              className="p-7"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {experience.role}
                  </h3>

                  <p className="mt-1 text-sm text-blue-400">
                    {experience.organization}
                  </p>

                  {experience.location && (
                    <p className="mt-1 text-xs text-white/40">
                      {experience.location}
                    </p>
                  )}
                </div>

                <span className="text-xs text-white/40">
                  {formatPeriod(
                    experience.startDate,
                    experience.endDate,
                    experience.isCurrent,
                  )}
                </span>
              </div>

              <p className="mt-5 text-sm leading-7 text-white/50">
                {experience.responsibilities}
              </p>

              {experience.learned && (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                    What I learned
                  </p>

                  <p className="mt-2 text-sm leading-7 text-white/50">
                    {experience.learned}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}