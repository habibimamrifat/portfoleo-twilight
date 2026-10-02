"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { callApi } from "@/api/callApi";

type ProjectStatus =
  | "IN_PROGRESS"
  | "DEVELOPED"
  | "DISCONTINUED";

type ProjectPlatform =
  | "WEBSITE"
  | "MOBILE"
  | "BACKEND"
  | "DESKTOP"
  | "API"
  | "OTHER";

interface ProjectFormData {
  name: string;
  description: string;
  liveLink: string;
  githubLink: string;
  status: ProjectStatus;
  platform: ProjectPlatform;
  featured: boolean;
  sortOrder: number;
}

interface ProjectFormProps {
  projectId?: string | null;
  initialData?: Partial<ProjectFormData> & {
    images?: string[];
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const emptyForm: ProjectFormData = {
  name: "",
  description: "",
  liveLink: "",
  githubLink: "",
  status: "IN_PROGRESS",
  platform: "WEBSITE",
  featured: false,
  sortOrder: 0,
};

const getImageUrl = (
  image?: string | null,
): string | null => {
  if (!image) {
    return null;
  }

  const trimmed = image.trim();

  if (!trimmed) {
    return null;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/${trimmed}`;
};

export default function ProjectForm({
  projectId = null,
  initialData,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const [form, setForm] =
    useState<ProjectFormData>({
      ...emptyForm,
      ...initialData,
    });

  const [selectedImages, setSelectedImages] =
    useState<File[]>([]);

  const [imagePreviews, setImagePreviews] =
    useState<string[]>([]);

  const [existingImages, setExistingImages] =
    useState<string[]>(
      initialData?.images ?? [],
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const isEditing = Boolean(projectId);

  /*
   * CLEAN UP OBJECT URLS
   */

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  /*
   * IMAGE SELECT
   */

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      event.target.files ?? [],
    );

    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    setError(null);

    const availableSlots =
      MAX_IMAGES -
      selectedImages.length -
      existingImages.length;

    if (availableSlots <= 0) {
      setError(
        `You can have a maximum of ${MAX_IMAGES} images.`,
      );
      return;
    }

    const filesToAdd = files.slice(
      0,
      availableSlots,
    );

    const invalidFile = filesToAdd.find(
      (file) =>
        !file.type.startsWith("image/"),
    );

    if (invalidFile) {
      setError(
        "Only image files are allowed.",
      );
      return;
    }

    const oversizedFile = filesToAdd.find(
      (file) =>
        file.size > MAX_IMAGE_SIZE,
    );

    if (oversizedFile) {
      setError(
        "Each image must be less than 5MB.",
      );
      return;
    }

    const newPreviews = filesToAdd.map(
      (file) =>
        URL.createObjectURL(file),
    );

    setSelectedImages((previous) => [
      ...previous,
      ...filesToAdd,
    ]);

    setImagePreviews((previous) => [
      ...previous,
      ...newPreviews,
    ]);
  };

  /*
   * REMOVE NEW IMAGE
   */

  const removeSelectedImage = (
    index: number,
  ) => {
    setImagePreviews((previous) => {
      const preview = previous[index];

      if (
        preview?.startsWith("blob:")
      ) {
        URL.revokeObjectURL(preview);
      }

      return previous.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      );
    });

    setSelectedImages((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      ),
    );
  };

  /*
   * REMOVE EXISTING IMAGE
   *
   * This only removes it from the form.
   * The backend currently appends newly
   * uploaded images and does not delete
   * Cloudinary images.
   */

  const removeExistingImage = (
    index: number,
  ) => {
    setExistingImages((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      ),
    );
  };

  /*
   * SUBMIT
   */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!form.description.trim()) {
      setError(
        "Project description is required.",
      );
      return;
    }

    if (!form.status) {
      setError("Project status is required.");
      return;
    }

    if (!form.platform) {
      setError(
        "Project platform is required.",
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const formData = new FormData();

      formData.append(
        "name",
        form.name.trim(),
      );

      formData.append(
        "description",
        form.description.trim(),
      );

      if (form.liveLink.trim()) {
        formData.append(
          "liveLink",
          form.liveLink.trim(),
        );
      }

      if (form.githubLink.trim()) {
        formData.append(
          "githubLink",
          form.githubLink.trim(),
        );
      }

      formData.append(
        "status",
        form.status,
      );

      formData.append(
        "platform",
        form.platform,
      );

      formData.append(
        "featured",
        String(form.featured),
      );

      formData.append(
        "sortOrder",
        String(form.sortOrder),
      );

      selectedImages.forEach((image) => {
        formData.append(
          "images",
          image,
        );
      });

      const response = projectId
        ? await callApi(
            `/projects/${projectId}`,
            "PATCH",
            formData,
            true,
          )
        : await callApi(
            "/projects",
            "POST",
            formData,
            true,
          );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Failed to ${
              projectId
                ? "update"
                : "create"
            } project.`,
        );
      }

      onSuccess?.();
    } catch (error) {
      console.error(
        "Failed to save project:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save project.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ERROR */}

      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError(null)
            }
            className="text-red-200/60 transition hover:text-red-200"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* NAME + PLATFORM */}

      <div className="grid gap-5 lg:grid-cols-2">
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
                name: event.target.value,
              }))
            }
            placeholder="Enter project name"
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
          />
        </div>

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
          className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-white/25"
        />
      </div>

      {/* LINKS */}

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-white/60">
            Live Project URL
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
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/60">
            GitHub URL
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
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
          />
        </div>
      </div>

      {/* IMAGES */}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm text-white/60">
            Project Images
          </label>

          <span className="text-xs text-white/30">
            {existingImages.length +
              selectedImages.length}{" "}
            / {MAX_IMAGES}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <label
            className={`flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 px-5 py-6 text-center transition ${
              existingImages.length +
                selectedImages.length >=
              MAX_IMAGES
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer hover:border-white/25 hover:bg-white/10"
            }`}
          >
            <ImagePlus
              size={30}
              className="mb-3 text-white/40"
              strokeWidth={1.5}
            />

            <span className="text-sm text-white/70">
              Add project images
            </span>

            <span className="mt-1 text-xs text-white/30">
              PNG, JPG, WEBP · Max 5MB
              each
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              disabled={
                existingImages.length +
                  selectedImages.length >=
                MAX_IMAGES
              }
              onChange={
                handleImageChange
              }
              className="hidden"
            />
          </label>

          <div className="flex min-h-36 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3">
            <span className="text-xs text-white/25">
              {existingImages.length +
                selectedImages.length >
              0
                ? "Images selected"
                : "No images selected"}
            </span>
          </div>
        </div>

        {(existingImages.length > 0 ||
          imagePreviews.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-3">
            {existingImages.map(
              (image, index) => {
                const imageUrl =
                  getImageUrl(image);

                if (!imageUrl) {
                  return null;
                }

                return (
                  <div
                    key={`existing-${index}`}
                    className="relative h-28 w-40 overflow-hidden rounded-xl border border-white/10 bg-white/5"
                  >
                    <Image
                      src={imageUrl}
                      alt={`Existing project image ${
                        index + 1
                      }`}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="160px"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeExistingImage(
                          index,
                        )
                      }
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-white/70 transition hover:bg-red-500/80 hover:text-white"
                      title="Remove image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              },
            )}

            {imagePreviews.map(
              (preview, index) => (
                <div
                  key={preview}
                  className="relative h-28 w-40 overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  <img
                    src={preview}
                    alt={`Selected project image ${
                      index + 1
                    }`}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeSelectedImage(
                        index,
                      )
                    }
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-white/70 transition hover:bg-red-500/80 hover:text-white"
                    title="Remove image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* STATUS + SORT ORDER */}

      <div className="grid gap-5 lg:grid-cols-2">
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

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Sort Order
          </label>

          <input
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                sortOrder:
                  Number(
                    event.target.value,
                  ) || 0,
              }))
            }
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/25"
          />
        </div>
      </div>

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
          className="h-4 w-4 rounded border-white/20 bg-white/5"
        />

        <div>
          <p className="text-sm text-white/70">
            Featured Project
          </p>

          <p className="text-xs text-white/30">
            Show this project as a featured
            project on your portfolio.
          </p>
        </div>
      </label>

      {/* ACTIONS */}

      <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} />
            Cancel
          </button>
        )}

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
          ) : isEditing ? (
            <Save size={17} />
          ) : (
            <Plus size={17} />
          )}

          {saving
            ? "Saving..."
            : isEditing
              ? "Update Project"
              : "Create Project"}
        </button>
      </div>
    </form>
  );
}