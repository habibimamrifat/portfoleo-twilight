"use client";

import { useState } from "react";
import {
  Loader2,
  Trash2,
} from "lucide-react";

import { callApi } from "@/api/callApi";

interface WorkSectorDeleteProps {
  sectorId: string;
  onChanged: () => void;
}

export default function WorkSectorDelete({
  sectorId,
  onChanged,
}: WorkSectorDeleteProps) {
  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this work sector?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await callApi(
        `/about-me/sectors/${sectorId}`,
        "DELETE",
        undefined,
        true,
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete work sector",
        );
      }

      onChanged();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="
          inline-flex items-center gap-2
          rounded-xl border border-red-400/20
          bg-red-500/10 px-3 py-2
          text-xs text-red-300
          transition hover:bg-red-500/20
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {deleting ? (
          <Loader2
            size={15}
            className="animate-spin"
          />
        ) : (
          <Trash2 size={15} />
        )}

        Delete
      </button>

      {error && (
        <p className="mt-2 text-xs text-red-300">
          {error}
        </p>
      )}
    </>
  );
}