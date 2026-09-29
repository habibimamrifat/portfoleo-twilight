"use client";

import { useState } from "react";

import {
  Loader2,
  Save,
} from "lucide-react";

import { callApi } from "@/api/callApi";

import type { AboutMeData } from "./AboutMe";

export default function AboutMeUpdate({
  aboutMe,
}: {
  aboutMe: AboutMeData;
}) {
  const [detailAboutMe, setDetailAboutMe] =
    useState(aboutMe.detailAboutMe);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response =
        await callApi(
          "/about-me",
          "PATCH",
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
            "Failed to update About Me",
        );
      }

      setSuccess(
        "About Me updated successfully.",
      );

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
          About Me
        </h2>

        <p className="mt-1 text-sm text-white/40">
          Manage the main description shown in your portfolio.
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

      {success && (
        <div
          className="
            mb-5 rounded-2xl border
            border-green-400/20 bg-green-500/10
            px-4 py-3 text-sm text-green-300
          "
        >
          {success}
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
              Saving...
            </>
          ) : (
            <>
              <Save size={17} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}