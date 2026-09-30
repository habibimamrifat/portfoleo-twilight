"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { getApi } from "@/api/getapi";

import EachWorkSectorCard, {
  WorkSectorData,
} from "./EachWorkSectorCard";

export default function WorkSectorList() {
  const [sectors, setSectors] = useState<WorkSectorData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSectors = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getApi(
        "/about-me/sectors",
        true,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to load Work Sectors",
        );
      }

      setSectors(result.data ?? result ?? []);
    } catch {
      setSectors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await getApi(
          "/about-me/sectors",
          true,
        );

        const result = await response.json();

        if (!mounted) return;

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load Work Sectors",
          );
        }

        setSectors(result.data ?? result ?? []);
      } catch {
        if (mounted) {
          setSectors([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

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
    );
  }

  return (
    <div className="space-y-4">
      {sectors.map((sector) => (
        <EachWorkSectorCard
          key={sector.id}
          sector={sector}
          onChanged={loadSectors}
        />
      ))}
    </div>
  );
}