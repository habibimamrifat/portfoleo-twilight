"use client";

import { useEffect, useState } from "react";

import { getApi } from "@/api/getapi";

import AboutMeCreate from "./AboutmeCreate";
import AboutMeUpdate from "./AboutMeUpdate";

interface WorkSectorData {
  id: string;
  aboutMeId: string;
  sectorImg: string;
  sectorName: string;
  sectorDetail: string;
  sortOrder: number;
  isActive: boolean;
}

export interface AboutMeData {
  id: string;
  userId: string;
  detailAboutMe: string;
  workSectors: WorkSectorData[];
}

export default function AboutMe() {
  const [aboutMe, setAboutMe] =
    useState<AboutMeData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const loadAboutMe = async () => {
      try {
        const response =
          await getApi(
            "/about-me",
            true,
          );

        const result =
          await response.json();

        if (!mounted) return;

        if (response.status === 404) {
          setAboutMe(null);
          return;
        }

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load About Me",
          );
        }

        setAboutMe(
          result.data ?? result,
        );
      } catch {
        if (mounted) {
          setAboutMe(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAboutMe();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return null;
  }

  if (!aboutMe) {
    return <AboutMeCreate />;
  }

  return (
    <AboutMeUpdate
      aboutMe={aboutMe}
    />
  );
}