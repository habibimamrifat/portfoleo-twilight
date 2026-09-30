"use client";

import { useEffect, useState } from "react";
import {
  ImagePlus,
  Loader2,
  Save,
  X,
} from "lucide-react";

import { getApi } from "@/api/getapi";
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

interface WorkSectorUpdateProps {
  sectorId: string;
  onChanged: () => void;
}

export default function WorkSectorUpdate({
  sectorId,
  onChanged,
}: WorkSectorUpdateProps) {
  const [open, setOpen] = useState(false);

  const [sector, setSector] =
    useState<WorkSectorData | null>(null);

  const [sectorName, setSectorName] =
    useState("");

  const [sectorDetail, setSectorDetail] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState("0");

  const [isActive, setIsActive] =
    useState(true);

  const [sectorImg, setSectorImg] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    const loadSector = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getApi(
          `/about-me/sectors/${sectorId}`,
          true,
        );

        const result = await response.json();

        if (!mounted) return;

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load work sector",
          );
        }

        const data =
          result.data ?? result;

        setSector(data);
        setSectorName(data.sectorName);
        setSectorDetail(data.sectorDetail);
        setSortOrder(
          String(data.sortOrder),
        );
        setIsActive(data.isActive);
        setSectorImg(null);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSector();

    return () => {
      mounted = false;
    };
  }, [open, sectorId]);

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

      const response = await callApi(
        `/about-me/sectors/${sectorId}`,
        "PATCH",
        formData,
        true,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update work sector",
        );
      }

      setOpen(false);
      setSectorImg(null);

      onChanged();
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

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          inline-flex items-center gap-2
          rounded-xl border border-white/10
          bg-white/5 px-3 py-2
          text-xs text-white/70
          transition hover:bg-white/10
        "
      >
        Update
      </button>
    );
  }

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60 p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          max-h-[90vh] w-full max-w-2xl
          overflow-y-auto
          rounded-3xl border border-white/20
          bg-[#111827] p-6
          shadow-[0_25px_80px_rgba(0,0,0,0.6)]
        "
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">
              Update Work Sector
            </h3>

            <p className="mt-1 text-sm text-white/40">
              Update the information for this sector.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={saving}
            className="
              rounded-xl border border-white/10
              bg-white/5 p-2
              text-white/60
              transition hover:bg-white/10
              disabled:opacity-50
            "
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <Loader2
              size={28}
              className="animate-spin text-white/50"
            />
          </div>
        ) : (
          <>
            {error && (
              <div
                className="
                  mb-5 rounded-2xl border
                  border-red-400/20
                  bg-red-500/10
                  px-4 py-3
                  text-sm text-red-300
                "
              >
                {error}
              </div>
            )}

            {sector && (
              <>
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
                      rounded-2xl
                      border border-white/15
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
                      rounded-2xl
                      border border-white/15
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
                    rounded-2xl
                    border border-white/15
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
                      className="
                        h-20 w-20
                        object-cover
                      "
                    />
                  </div>

                  <label
                    className="
                      flex flex-1 cursor-pointer
                      items-center gap-3
                      rounded-2xl
                      border border-white/15
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

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="
                      inline-flex items-center gap-2
                      rounded-2xl
                      border border-white/20
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
                        Update Sector
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}