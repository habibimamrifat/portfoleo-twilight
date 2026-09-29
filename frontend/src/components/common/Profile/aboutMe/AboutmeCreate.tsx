"use client";

import { useState } from "react";

import {
  Loader2,
  Plus,
} from "lucide-react";

import { callApi } from "@/api/callApi";

export default function AboutMeCreate() {
  const [detailAboutMe, setDetailAboutMe] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");

      const response =
        await callApi(
          "/about-me",
          "POST",
          {
            detailAboutMe:
              detailAboutMe.trim(),
          },
          true,
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to create About Me",
        );
      }

      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="
        rounded-3xl border border-white/20
        bg-white/5 p-6
        shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        backdrop-blur-xs
      "
    >
      <div className="mb-6">
        <h2 className="text-lg font-medium text-white">
          Create About Me
        </h2>

        <p className="mt-1 text-sm text-white/40">
          Add the main description shown in your portfolio.
        </p>
      </div>

      {error && (
        <div
          className="
            mb-5 rounded-2xl border
            border-red-400/20 bg-red-500/10
            px-4 py-3 text-sm text-red-300
          "
        >
          {error}
        </div>
      )}

      <textarea
        value={detailAboutMe}
        onChange={(event) =>
          setDetailAboutMe(
            event.target.value,
          )
        }
        placeholder="Write something about yourself..."
        rows={8}
        className="
          w-full resize-y rounded-2xl
          border border-white/15
          bg-white/5 px-4 py-3
          text-sm text-white
          outline-none
          placeholder:text-white/25
          focus:border-white/30
          focus:bg-white/10
        "
      />

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            saving ||
            !detailAboutMe.trim()
          }
          className="
            inline-flex items-center gap-2
            rounded-2xl border border-white/20
            bg-white/10 px-6 py-3
            text-sm font-medium text-white
            shadow-lg backdrop-blur-xs
            transition hover:bg-white/15
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {saving ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />
              Creating...
            </>
          ) : (
            <>
              <Plus size={17} />
              Create About Me
            </>
          )}
        </button>
      </div>
    </div>
  );
}