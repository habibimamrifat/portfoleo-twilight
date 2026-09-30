"use client";

import { useEffect, useState } from "react";

import { getApi } from "@/api/getapi";
import Appear from "../../animation/Appear";
import Card from "../../util/Card";

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

interface AboutMeProps {
  isAdmin?: boolean;
}

export default function AboutMe({
  isAdmin = false,
}: AboutMeProps) {
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
            isAdmin,
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
  }, [isAdmin]);

  if (loading) {
    return null;
  }

  if (!aboutMe) {
    if (isAdmin) {
      return <AboutMeCreate />;
    }

    return null;
  }

  if (!isAdmin) {
    return (
      <Appear delay={0.2}>
        <Card className="p-8">
          <p className="max-w-3xl text-base leading-8 text-white/60">
            {aboutMe.detailAboutMe}
          </p>
        </Card>
      </Appear>
    );
  }

  return (
    <AboutMeUpdate
      aboutMe={aboutMe}
    />
  );
}