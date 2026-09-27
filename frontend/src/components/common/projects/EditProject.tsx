"use client";

import Image from "next/image";
import {
  ImagePlus,
  Loader2,
  Save,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import Card from "@/components/common/util/Card";

import { getApi } from "@/api/getapi";
import { callApi } from "@/api/callApi";

export type ProjectStatus =
  | "IN_PROGRESS"
  | "DEVELOPED"
  | "DISCONTINUED";

export type ProjectPlatform =
  | "WEBSITE"
  | "MOBILE"
  | "BACKEND"
  | "DESKTOP"
  | "API"
  | "OTHER";

export interface ProjectFormData {
  name: string;
  description: string;
  liveLink: string;
  githubLink: string;
  status: ProjectStatus;
  platform: ProjectPlatform;
  approachTaken: string;
  featured: boolean;
  sortOrder: string;
  isActive: boolean;
  images: string[];
}

interface EditProjectProps {
  projectId: string;
  refreshParent: () => void;
  onCancel: () => void;
}

const emptyForm: ProjectFormData = {
  name: "",
  description: "",
  liveLink: "",
  githubLink: "",
  status: "IN_PROGRESS",
  platform: "WEBSITE",
  approachTaken: "",
  featured: false,
  sortOrder: "0",
  isActive: true,
  images: [],
};

export default function EditProject({
  projectId,
  refreshParent,
  onCancel,
}: EditProjectProps) {
  const [form, setForm] =
    useState<ProjectFormData>(emptyForm);

  const [selectedImages, setSelectedImages] =
    useState<File[]>([]);

  const [imagePreviews, setImagePreviews] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* =========================================================
     FETCH PROJECT
     ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getApi(
          `/projects/${projectId}`,
          true,
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to load project.",
          );
        }

        const project =
          result?.data?.data ??
          result?.data ??
          result;

        if (cancelled) {
          return;
        }

        setForm({
          name: project.name ?? "",
          description:
            project.description ?? "",
          liveLink:
            project.liveLink ?? "",
          githubLink:
            project.githubLink ?? "",
          status:
            project.status ===
              "DEVELOPED" ||
            project.status ===
              "DISCONTINUED"
              ? project.status
              : "IN_PROGRESS",
          platform:
            project.platform ===
              "MOBILE" ||
            project.platform ===
              "BACKEND" ||
            project.platform ===
              "DESKTOP" ||
            project.platform ===
              "API" ||
            project.platform ===
              "OTHER"
              ? project.platform
              : "WEBSITE",
          approachTaken:
            project.approachTaken ?? "",
          featured:
            project.featured ?? false,
          sortOrder: String(
            project.sortOrder ?? 0,
          ),
          isActive:
            project.isActive ?? true,
          images:
            project.images ?? [],
        });

        setImagePreviews(
          project.images ?? [],
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load project.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProject();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  /* =========================================================
     IMAGE CLEANUP
     ========================================================= */

  useEffect(() => {
    return () => {
      imagePreviews.forEach(
        (preview) => {
          if (preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
          }
        },
      );
    };
  }, [imagePreviews]);

  /* =========================================================
     IMAGE SELECT
     ========================================================= */

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      event.target.files ?? [],
    );

    if (files.length === 0) {
      return;
    }

    const invalidFile = files.find(
      (file) => {
        if (!file.type.startsWith("image/")) {
          return true;
        }

        if (
          file.size >
          5 * 1024 * 1024
        ) {
          return true;
        }

        return false;
      },
    );

    if (invalidFile) {
      if (
        !invalidFile.type.startsWith(
          "image/",
        )
      ) {
        setError(
          "Please select image files only.",
        );
      } else {
        setError(
          "Each image must be less than 5MB.",
        );
      }

      event.target.value = "";

      return;
    }

    setError(null);

    setSelectedImages(
      (previous) => [
        ...previous,
        ...files,
      ],
    );

    const previews = files.map(
      (file) =>
        URL.createObjectURL(file),
    );

    setImagePreviews(
      (previous) => [
        ...previous,
        ...previews,
      ],
    );

    event.target.value = "";
  };

  /* =========================================================
     REMOVE NEW IMAGE
     ========================================================= */

  const removeSelectedImage = (
    index: number,
  ) => {
    const existingImageCount =
      form.images.length;

    const previewIndex =
      existingImageCount + index;

    const preview =
      imagePreviews[previewIndex];

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setSelectedImages(
      (previous) =>
        previous.filter(
          (_, imageIndex) =>
            imageIndex !== index,
        ),
    );

    setImagePreviews(
      (previous) =>
        previous.filter(
          (_, imageIndex) =>
            imageIndex !== previewIndex,
        ),
    );
  };

  /* =========================================================
     SUBMIT
     ========================================================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError(
        "Project name is required.",
      );
      return;
    }

    if (!form.description.trim()) {
      setError(
        "Project description is required.",
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const formData =
        new FormData();

      formData.append(
        "name",
        form.name.trim(),
      );

      formData.append(
        "description",
        form.description.trim(),
      );

      formData.append(
        "liveLink",
        form.liveLink.trim(),
      );

      formData.append(
        "githubLink",
        form.githubLink.trim(),
      );

      formData.append(
        "status",
        form.status,
      );

      formData.append(
        "platform",
        form.platform,
      );

      formData.append(
        "approachTaken",
        form.approachTaken.trim(),
      );

      formData.append(
        "featured",
        String(form.featured),
      );

      formData.append(
        "sortOrder",
        form.sortOrder || "0",
      );

      formData.append(
        "isActive",
        String(form.isActive),
      );

      selectedImages.forEach(
        (image) => {
          formData.append(
            "images",
            image,
          );
        },
      );

      const response =
        await callApi(
          `/projects/${projectId}`,
          "PATCH",
          formData,
          true,
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to update project.",
        );
      }

      /*
       * Tell the parent to reload
       * the project list.
       */
      refreshParent();

      /*
       * Close the edit form after
       * successful update.
       */
      onCancel();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update project.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex min-h-60 items-center justify-center">
          <Loader2
            size={26}
            className="animate-spin text-white/40"
          />
        </div>
      </Card>
    );
  }

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <Card className="p-6">
      {/* FORM HEADER */}

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Edit Project
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Update your project.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={16} />
          Cancel
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* NAME */}

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Project Name
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                name:
                  event.target.value,
              }))
            }
            placeholder="Enter project name"
            disabled={saving}
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
          />
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Description
          </label>

          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                description:
                  event.target.value,
              }))
            }
            rows={5}
            placeholder="Describe the project..."
            disabled={saving}
            className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-white/25"
          />
        </div>

        {/* LINKS */}

        <div className="grid gap-5 lg:grid-cols-2">
          {/* LIVE LINK */}

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Live Link
            </label>

            <input
              type="url"
              value={form.liveLink}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  liveLink:
                    event.target.value,
                }))
              }
              placeholder="https://example.com"
              disabled={saving}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </div>

          {/* GITHUB LINK */}

          <div>
            <label className="mb-2 block text-sm text-white/60">
              GitHub Link
            </label>

            <input
              type="url"
              value={form.githubLink}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  githubLink:
                    event.target.value,
                }))
              }
              placeholder="https://github.com/..."
              disabled={saving}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </div>
        </div>

        {/* STATUS + PLATFORM */}

        <div className="grid gap-5 lg:grid-cols-2">
          {/* STATUS */}

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Status
            </label>

            <select
              value={form.status}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  status:
                    event.target
                      .value as ProjectStatus,
                }))
              }
              disabled={saving}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/25"
            >
              <option
                value="IN_PROGRESS"
                className="bg-black"
              >
                In Progress
              </option>

              <option
                value="DEVELOPED"
                className="bg-black"
              >
                Developed
              </option>

              <option
                value="DISCONTINUED"
                className="bg-black"
              >
                Discontinued
              </option>
            </select>
          </div>

          {/* PLATFORM */}

          <div>
            <label className="mb-2 block text-sm text-white/60">
              Platform
            </label>

            <select
              value={form.platform}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  platform:
                    event.target
                      .value as ProjectPlatform,
                }))
              }
              disabled={saving}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/25"
            >
              <option
                value="WEBSITE"
                className="bg-black"
              >
                Website
              </option>

              <option
                value="MOBILE"
                className="bg-black"
              >
                Mobile
              </option>

              <option
                value="BACKEND"
                className="bg-black"
              >
                Backend
              </option>

              <option
                value="DESKTOP"
                className="bg-black"
              >
                Desktop
              </option>

              <option
                value="API"
                className="bg-black"
              >
                API
              </option>

              <option
                value="OTHER"
                className="bg-black"
              >
                Other
              </option>
            </select>
          </div>
        </div>

        {/* APPROACH */}

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Approach Taken
          </label>

          <textarea
            value={form.approachTaken}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                approachTaken:
                  event.target.value,
              }))
            }
            rows={6}
            placeholder="Describe the technical approach, architecture, important decisions, etc..."
            disabled={saving}
            className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-white/25"
          />
        </div>

        {/* SORT ORDER */}

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Sort Order
          </label>

          <input
            type="number"
            min="0"
            value={form.sortOrder}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                sortOrder:
                  event.target.value,
              }))
            }
            disabled={saving}
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/25"
          />
        </div>

        {/* IMAGES */}

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Project Images
          </label>

          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            {/* UPLOAD */}

            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 px-5 py-6 text-center transition hover:border-white/25 hover:bg-white/10">
              <ImagePlus
                size={28}
                className="mb-3 text-white/40"
                strokeWidth={1.5}
              />

              <span className="text-sm text-white/70">
                Add project images
              </span>

              <span className="mt-1 text-xs text-white/30">
                PNG, JPG, WEBP · Max 5MB each
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={saving}
                className="hidden"
              />
            </label>

            {/* PREVIEW */}

            {imagePreviews.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {imagePreviews.map(
                  (preview, index) => {
                    const isNewImage =
                      index >=
                      form.images.length;

                    const newImageIndex =
                      index -
                      form.images.length;

                    return (
                      <div
                        key={`${preview}-${index}`}
                        className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/5"
                      >
                        <Image
                          src={preview}
                          alt={`Project image ${index + 1}`}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="140px"
                        />

                        {isNewImage && (
                          <button
                            type="button"
                            onClick={() =>
                              removeSelectedImage(
                                newImageIndex,
                              )
                            }
                            disabled={saving}
                            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white/60 backdrop-blur-md transition hover:bg-black/80 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Remove image"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <div className="flex h-36 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <span className="text-xs text-white/25">
                  No images
                </span>
              </div>
            )}
          </div>

          <p className="mt-2 text-xs text-white/25">
            Existing images are kept. New images
            will be added to the project.
          </p>
        </div>

        {/* OPTIONS */}

        <div className="grid gap-4 lg:grid-cols-2">
          {/* FEATURED */}

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  featured:
                    event.target.checked,
                }))
              }
              disabled={saving}
              className="h-4 w-4 rounded border-white/20 bg-white/5"
            />

            <span>
              <span className="block text-sm text-white/70">
                Featured Project
              </span>

              <span className="block text-xs text-white/25">
                Show this project as featured.
              </span>
            </span>
          </label>

          {/* ACTIVE */}

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  isActive:
                    event.target.checked,
                }))
              }
              disabled={saving}
              className="h-4 w-4 rounded border-white/20 bg-white/5"
            />

            <span>
              <span className="block text-sm text-white/70">
                Active Project
              </span>

              <span className="block text-xs text-white/25">
                Show this project in active
                listings.
              </span>
            </span>
          </label>
        </div>

        {/* SUBMIT */}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} />
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {saving
              ? "Saving..."
              : "Update Project"}
          </button>
        </div>
      </form>
    </Card>
  );
}