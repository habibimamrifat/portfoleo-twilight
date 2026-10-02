"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Loader2 } from "lucide-react";

import { getApi } from "@/api/getapi";

import EachProjectApproachCard, {
  ProjectApproachData,
} from "./EachProjectApproachCard";

import Appear from "../../animation/Appear";

interface ProjectApproachListProps {
  projectId: string;
  isAdmin?: boolean;
  projectApproachListReload?: number;
  onChanged?: () => void;
}

export default function ProjectApproachList({
  projectId,
  isAdmin = false,
  projectApproachListReload = 0,
  onChanged,
}: ProjectApproachListProps) {
  const [approaches, setApproaches] =
    useState<ProjectApproachData[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadApproaches =
    useCallback(async () => {
      try {
        setLoading(true);

        const response = await getApi(
          `/projects/${projectId}/approaches`,
          isAdmin,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load project approaches.",
          );
        }

        setApproaches(
          result.data ??
            result ??
            [],
        );
      } catch {
        setApproaches([]);
      } finally {
        setLoading(false);
      }
    }, [projectId, isAdmin]);

  useEffect(() => {
    loadApproaches();
  }, [
    loadApproaches,
    projectApproachListReload,
  ]);

  if (loading) {
    return (
      <div
        className="
          flex min-h-[180px]
          items-center justify-center
          rounded-2xl
          border border-white/10
          bg-white/[0.03]
        "
      >
        <Loader2
          size={24}
          className="animate-spin text-white/50"
        />
      </div>
    );
  }

  if (!approaches.length) {
    return (
      <div
        className="
          rounded-2xl
          border border-white/10
          bg-white/[0.03]
          px-4 py-6
          text-center
          text-sm text-white/40
        "
      >
        No project approaches added yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {approaches.map((approach, index) => (
        <Appear
          key={`${projectApproachListReload}-${approach.id}`}
          direction={
            index % 2 === 0
              ? "left"
              : "right"
          }
          delay={0.1 + index * 0.08}
          duration={0.6}
        >
          <div className="min-h-[280px] h-full">
            <EachProjectApproachCard
              approach={approach}
              projectId={projectId}
              isAdmin={isAdmin}
              onChanged={
                onChanged ??
                loadApproaches
              }
            />
          </div>
        </Appear>
      ))}
    </div>
  );
}