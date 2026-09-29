"use client";

import { useState } from "react";

import {
  ImagePlus,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

import { callApi } from "@/api/callApi";

interface WorkSectorData {
  id: string;
  aboutMeId: string;
  sectorImg: string;
  sectorName: string;
  sectorDetail: string;
  sortOrder: number;
  isActive: boolean;
}

export default function WorkSectorUpdate({
  sector,
  onUpdated,
}: {
  sector: WorkSectorData;
  onUpdated: () => void;
}) {
  const [sectorName, setSectorName] =
    useState(sector.sectorName);

  const [sectorDetail, setSectorDetail] =
    useState(sector.sectorDetail);

  const [sortOrder, setSortOrder] =
    useState(String(sector.sortOrder));

  const [isActive, setIsActive] =
    useState(sector.isActive);

  const [sectorImg, setSectorImg] =
    useState<File | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async () => {
    if (!sectorName.trim()) {
      setError("Sector name is required.");
      return;
    }

    if (!sectorDetail.trim()) {
      setError("Sector detail is required.");
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
        "isActive",
        String(isActive),
      );

      if (sectorImg) {
        formData.append(
          "sectorImg",
          sectorImg,
        );
      }

      const response =
        await callApi(
          `/about-me/sectors/${sector.id}`,
          "PATCH",
          formData,
          true,
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update work sector",
        );
      }

      setSectorImg(null);

      onUpdated();
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

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this work sector?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response =
        await callApi(
          `/about-me/sectors/${sector.id}`,
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

      onUpdated();
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
    <div
      className="
        rounded-2xl border border-white/10
        bg-white/[0.03] p-5
      "
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium text-white">
          {sector.sectorName}
        </h3>

        <button
          type="button"
          onClick={handleDelete}
          disabled={
            saving || deleting
          }
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
            setSectorName(
              event.target.value,
            )
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
            setSortOrder(
              event.target.value,
            )
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

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="overflow-hidden rounded-xl border border-white/10">
          <img
            src={sector.sectorImg}
            alt={sector.sectorName}
            className="h-20 w-20 object-cover"
          />
        </div>

        <label
          className="
            flex flex-1 cursor-pointer
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
              : "Replace sector image"}
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
      </div>

      <label className="mt-4 flex items-center gap-3 text-sm text-white/60">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) =>
            setIsActive(
              event.target.checked,
            )
          }
          className="h-4 w-4"
        />

        Active
      </label>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            saving || deleting
          }
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
              Saving...
            </>
          ) : (
            <>
              <Save size={17} />
              Save Sector
            </>
          )}
        </button>
      </div>
    </div>
  );
}