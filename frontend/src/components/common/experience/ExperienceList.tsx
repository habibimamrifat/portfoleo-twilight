"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  BriefcaseBusiness,
  Loader2,
} from "lucide-react";

import Card from "@/components/common/util/Card";
import Appear from "@/components/common/animation/Appear";

import { getApi } from "@/api/getapi";

import EachExperienceCard, {
  type Experience,
} from "./EachExperienceCard";

interface ExperienceListProps {
  isAdmin?: boolean;
  isPortfolio?: boolean;
}

const normalizeExperience = (
  raw: Record<string, unknown>,
  index: number,
): Experience => {
  const id =
    raw.id ??
    raw._id ??
    raw.experienceId ??
    raw.experience_id ??
    `experience-${index}`;

  const images = Array.isArray(raw.images)
    ? raw.images.map(String)
    : [];

  return {
    id: String(id),

    organization: String(
      raw.organization ??
        raw.company ??
        "Unknown Organization",
    ),

    role: String(
      raw.role ??
        raw.position ??
        "Unknown Role",
    ),

    responsibilities: String(
      raw.responsibilities ??
        raw.description ??
        "",
    ),

    learned:
      raw.learned !== null &&
      raw.learned !== undefined
        ? String(raw.learned)
        : null,

    location:
      raw.location !== null &&
      raw.location !== undefined
        ? String(raw.location)
        : null,

    images,

    employmentType: String(
      raw.employmentType ??
        raw.employment_type ??
        "OTHER",
    ),

    startDate: String(
      raw.startDate ??
        raw.start_date ??
        new Date().toISOString(),
    ),

    endDate:
      raw.endDate !== null &&
      raw.endDate !== undefined
        ? String(raw.endDate)
        : null,

    isCurrent: Boolean(
      raw.isCurrent ??
        raw.is_current ??
        false,
    ),

    experienceLetterUrl:
      raw.experienceLetterUrl !== null &&
      raw.experienceLetterUrl !== undefined
        ? String(
            raw.experienceLetterUrl,
          )
        : null,

    sortOrder: Number(
      raw.sortOrder ??
        raw.sort_order ??
        index,
    ),

    isActive:
      raw.isActive !== undefined
        ? Boolean(raw.isActive)
        : true,

    createdAt:
      raw.createdAt !== null &&
      raw.createdAt !== undefined
        ? String(raw.createdAt)
        : undefined,

    updatedAt:
      raw.updatedAt !== null &&
      raw.updatedAt !== undefined
        ? String(raw.updatedAt)
        : undefined,
  };
};

function extractExperiences(
  result: unknown,
): Experience[] {
  if (Array.isArray(result)) {
    return result.map((item, index) =>
      normalizeExperience(
        item as Record<string, unknown>,
        index,
      ),
    );
  }

  if (
    !result ||
    typeof result !== "object"
  ) {
    return [];
  }

  const response =
    result as Record<string, unknown>;

  const containers = [
    response.data,
    response.experiences,
    response.items,
    response.results,
  ];

  for (const container of containers) {
    if (Array.isArray(container)) {
      return container.map(
        (item, index) =>
          normalizeExperience(
            item as Record<
              string,
              unknown
            >,
            index,
          ),
      );
    }

    if (
      container &&
      typeof container === "object"
    ) {
      const nested =
        container as Record<
          string,
          unknown
        >;

      const nestedArrays = [
        nested.data,
        nested.experiences,
        nested.items,
        nested.results,
      ];

      for (const nestedArray of nestedArrays) {
        if (Array.isArray(nestedArray)) {
          return nestedArray.map(
            (item, index) =>
              normalizeExperience(
                item as Record<
                  string,
                  unknown
                >,
                index,
              ),
          );
        }
      }
    }
  }

  return [];
}

export default function ExperienceList({
  isAdmin = false,
  isPortfolio = false,
}: ExperienceListProps) {
  const [experiences, setExperiences] =
    useState<Experience[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchExperiences = useCallback(
    async () => {
      try {
        const response = await getApi(
          "/experiences",
          isAdmin,
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to fetch experiences.",
          );
        }

        const data =
          extractExperiences(result);

        data.sort(
          (a, b) =>
            a.sortOrder -
            b.sortOrder,
        );

        setExperiences(data);
        setError(null);
      } catch (error) {
        console.error(
          "Failed to fetch experiences:",
          error,
        );

        setExperiences([]);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch experiences.",
        );
      } finally {
        setLoading(false);
      }
    },
    [isAdmin],
  );

  useEffect(() => {
    let cancelled = false;

    const loadExperiences = async () => {
      if (cancelled) {
        return;
      }

      await fetchExperiences();
    };

    void loadExperiences();

    return () => {
      cancelled = true;
    };
  }, [fetchExperiences]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-white/40">
          <Loader2
            size={20}
            className="animate-spin"
          />

          <span>
            Loading experiences...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
          <BriefcaseBusiness
            size={32}
            strokeWidth={1.4}
            className="text-white/30"
          />

          <h3 className="mt-4 text-lg font-medium text-white">
            Unable to load experiences
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              void fetchExperiences()
            }
            className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Try Again
          </button>
        </div>
      </Card>
    );
  }

  if (experiences.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
          <BriefcaseBusiness
            size={32}
            strokeWidth={1.4}
            className="text-white/30"
          />

          <h3 className="mt-4 text-lg font-medium text-white">
            No experiences found
          </h3>

          <p className="mt-2 text-sm text-white/40">
            {isAdmin
              ? "There are no experiences available."
              : "There are no published experiences available right now."}
          </p>
        </div>
      </Card>
    );
  }

  const displayedExperiences =
    isPortfolio
      ? experiences.slice(0, 4)
      : experiences;

  return (
    <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
      {displayedExperiences.map(
        (experience, index) => {
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
              <EachExperienceCard
                experience={experience}
                isAdmin={isAdmin}
                reloadList={fetchExperiences}
              />
            </Appear>
          );
        },
      )}
    </div>
  );
}