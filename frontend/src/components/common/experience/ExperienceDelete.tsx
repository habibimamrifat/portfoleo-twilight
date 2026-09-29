"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { callApi } from "@/api/callApi";

interface ExperienceDeleteProps {
  experienceId: string;
  reloadList?: () => void | Promise<void>;
}

export default function ExperienceDelete({
  experienceId,
  reloadList,
}: ExperienceDeleteProps) {
  const [deleting, setDeleting] =
    useState(false);

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this experience?",
      );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response =
        await callApi(
          `/experiences/${experienceId}`,
          "DELETE",
          undefined,
          true,
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(
            result?.message,
          )
            ? result.message.join(
                ", ",
              )
            : result?.message ??
                "Failed to delete experience",
        );
      }

      await reloadList?.();
    } catch (error) {
      console.error(
        "Failed to delete experience:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete experience",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="
        flex h-10
        items-center
        gap-2
        rounded-xl
        border
        border-white/10
        bg-white/5
        px-3
        text-sm
        text-white/50
        transition
        hover:bg-white/10
        hover:text-white
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
      title="Delete experience"
    >
      {deleting ? (
        <Loader2
          size={16}
          className="animate-spin"
        />
      ) : (
        <Trash2
          size={16}
          strokeWidth={1.6}
        />
      )}

      <span className="hidden sm:inline">
        {deleting
          ? "Deleting..."
          : "Delete"}
      </span>
    </button>
  );
}