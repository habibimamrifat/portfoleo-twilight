"use client";

import { useState } from "react";

import {
  ImagePlus,
  Loader2,
  Plus,
} from "lucide-react";

import { callApi } from "@/api/callApi";

export default function WorkSectorCreate({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [sectorName, setSectorName] =
    useState("");

  const [sectorDetail, setSectorDetail] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState("0");

  const [sectorImg, setSectorImg] =
    useState<File | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const resetForm = () => {
    setSectorName("");
    setSectorDetail("");
    setSortOrder("0");
    setSectorImg(null);
  };

  const handleSubmit = async () => {
    if (!sectorName.trim()) {
      setError("Sector name is required.");
      return;
    }

    if (!sectorDetail.trim()) {
      setError("Sector detail is required.");
      return;
    }

    if (!sectorImg) {
      setError("Sector image is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      formData.append(
        "sectorName",
        sectorName.trim(),
      );

      formData.append(
        "sectorDetail",
        sectorDetail.trim(),
      );

      formData.append(
        "sortOrder",
        sortOrder,
      );

      formData.append(
        "sectorImg",
        sectorImg,
      );

      const response =
        await callApi(
          "/about-me/sectors",
          "POST",
          formData,
          true,
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to create work sector",
        );
      }

      resetForm();
      onCreated();
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
        rounded-2xl border border-white/10
        bg-white/[0.03] p-5
      "
    >
      <div className="mb-5 flex items-center gap-2">
        <Plus
          size={18}
          className="text-white/60"
        />

        <h3 className="text-sm font-medium text-white">
          Add Work Sector
        </h3>
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

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={sectorName}
          onChange={(event) =>
            setSectorName(event.target.value)
          }
          placeholder="Sector name"
          className="
            rounded-2xl border border-white/15
            bg-white/5 px-4 py-3
            text-sm text-white
            outline-none
            placeholder:text-white/25
            focus:border-white/30
          "
        />

        <input
          type="number"
          min="0"
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(event.target.value)
          }
          placeholder="Sort order"
          className="
            rounded-2xl border border-white/15
            bg-white/5 px-4 py-3
            text-sm text-white
            outline-none
            placeholder:text-white/25
            focus:border-white/30
          "
        />
      </div>

      <textarea
        value={sectorDetail}
        onChange={(event) =>
          setSectorDetail(
            event.target.value,
          )
        }
        placeholder="Describe this sector..."
        rows={4}
        className="
          mt-4 w-full resize-y
          rounded-2xl border border-white/15
          bg-white/5 px-4 py-3
          text-sm text-white
          outline-none
          placeholder:text-white/25
          focus:border-white/30
        "
      />

      <label
        className="
          mt-4 flex cursor-pointer
          items-center gap-3
          rounded-2xl border border-white/15
          bg-white/5 px-4 py-3
          text-sm text-white/60
          transition hover:bg-white/10
        "
      >
        <ImagePlus size={18} />

        <span>
          {sectorImg
            ? sectorImg.name
            : "Choose sector image"}
        </span>

        <input
          type="file"
          accept="image/*"
          onChange={(event) =>
            setSectorImg(
              event.target.files?.[0] ??
                null,
            )
          }
          className="hidden"
        />
      </label>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="
            inline-flex items-center gap-2
            rounded-2xl border border-white/20
            bg-white/10 px-5 py-3
            text-sm font-medium text-white
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
              Add Sector
            </>
          )}
        </button>
      </div>
    </div>
  );
}