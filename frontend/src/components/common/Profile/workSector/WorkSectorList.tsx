"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { getApi } from "@/api/getapi";

import EachWorkSectorCard, {
  WorkSectorData,
} from "./EachWorkSectorCard";
import Appear from "../../animation/Appear";

export default function WorkSectorList({
  isAdmin = false,
  refresh = 0,
}: {
  isAdmin?: boolean;
  refresh?: number;
}) {
  const [sectors, setSectors] =
    useState<WorkSectorData[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadSectors = useCallback(async () => {
    try {
      setLoading(true);

      const response =
        await getApi(
          "/about-me/sectors",
          true,
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to load Work Sectors",
        );
      }

      setSectors(
        result.data ??
          result ??
          [],
      );
    } catch {
      setSectors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSectors();
  }, [loadSectors, refresh]);

  if (loading) {
    return (
      <div
        className="
          flex min-h-[180px]
          items-center justify-center
          rounded-2xl border border-white/10
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

  if (!sectors.length) {
    return (
      <Appear
        direction="top"
        delay={0.2}
        duration={0.8}
      >
        <div
          className="
            rounded-2xl border border-white/10
            bg-white/[0.03]
            px-4 py-6
            text-center text-sm text-white/40
          "
        >
          No work sectors added yet.
        </div>
      </Appear>
    );
  }

  return (
    <Appear
      direction="top"
      delay={0.2}
      duration={0.8}
    >
            <div className="mb-6">
              <h2 className="text-lg font-medium text-white">
                Work Sectors
              </h2>
      
              <p className="mt-1 text-sm text-white/40">
                Areas that I work on.
              </p>
            </div>
            
      <div className="flex flex-wrap gap-4">
        {sectors.map((sector) => (
          <EachWorkSectorCard
            key={`${refresh}-${sector.id}`}
            sector={sector}
            isAdmin={isAdmin}
            onChanged={loadSectors}
          />
        ))}
      </div>
    </Appear>
  );
}