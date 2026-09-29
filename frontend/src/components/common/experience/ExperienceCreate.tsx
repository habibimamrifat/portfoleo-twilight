"use client";

import Image from "next/image";
import {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  X,
} from "lucide-react";

import Card from "@/components/common/util/Card";
import { callApi } from "@/api/callApi";

type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE"
  | "TEMPORARY"
  | "OTHER";

interface ExperienceForm {
  organization: string;
  role: string;
  responsibilities: string;
  learned: string;
  location: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  experienceLetterUrl: string;
  sortOrder: string;
  isActive: boolean;
}

interface ExperienceCreateProps {
  reloadList?: () => void | Promise<void>;
}

const MAX_IMAGES = 10;

const initialForm: ExperienceForm = {
  organization: "",
  role: "",
  responsibilities: "",
  learned: "",
  location: "",
  employmentType: "FULL_TIME",
  startDate: "",
  endDate: "",
  isCurrent: false,
  experienceLetterUrl: "",
  sortOrder: "0",
  isActive: true,
};

export default function ExperienceCreate({
  reloadList,
}: ExperienceCreateProps) {
  const [form, setForm] =
    useState<ExperienceForm>(initialForm);

  const [selectedImages, setSelectedImages] =
    useState<File[]>([]);

  const [previewImages, setPreviewImages] =
    useState<string[]>([]);

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >,
  ) => {
    const target = event.target;

    const { name, value } = target;

    setForm((previous) => ({
      ...previous,
      [name]:
        target instanceof HTMLInputElement &&
        target.type === "checkbox"
          ? target.checked
          : value,
    }));

    setError(null);
    setSuccess(null);
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      event.target.files ?? [],
    );

    if (files.length === 0) {
      return;
    }

    const availableSlots =
      MAX_IMAGES - selectedImages.length;

    if (availableSlots <= 0) {
      setError(
        `You can upload a maximum of ${MAX_IMAGES} images.`,
      );

      event.target.value = "";
      return;
    }

    const filesToAdd = files.slice(
      0,
      availableSlots,
    );

    const newPreviewUrls =
      filesToAdd.map((file) =>
        URL.createObjectURL(file),
      );

    setSelectedImages((previous) => [
      ...previous,
      ...filesToAdd,
    ]);

    setPreviewImages((previous) => [
      ...previous,
      ...newPreviewUrls,
    ]);

    if (
      files.length >
      filesToAdd.length
    ) {
      setError(
        `Only ${availableSlots} image${
          availableSlots === 1
            ? ""
            : "s"
        } could be added.`,
      );
    } else {
      setError(null);
    }

    setSuccess(null);

    event.target.value = "";
  };

  const removeImage = (
    index: number,
  ) => {
    const previewUrl =
      previewImages[index];

    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl,
      );
    }

    setSelectedImages((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      ),
    );

    setPreviewImages((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      ),
    );
  };

  const clearImages = () => {
    previewImages.forEach((url) =>
      URL.revokeObjectURL(url),
    );

    setSelectedImages([]);
    setPreviewImages([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    clearImages();

    setForm(initialForm);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (
        !form.organization.trim()
      ) {
        throw new Error(
          "Organization is required.",
        );
      }

      if (!form.role.trim()) {
        throw new Error(
          "Role is required.",
        );
      }

      if (
        !form.responsibilities.trim()
      ) {
        throw new Error(
          "Responsibilities are required.",
        );
      }

      if (!form.startDate) {
        throw new Error(
          "Start date is required.",
        );
      }

      if (
        !form.isCurrent &&
        !form.endDate
      ) {
        throw new Error(
          "End date is required when the experience is not current.",
        );
      }

      if (
        !form.isCurrent &&
        form.endDate &&
        form.startDate >
          form.endDate
      ) {
        throw new Error(
          "End date cannot be before the start date.",
        );
      }

      if (
        selectedImages.length >
        MAX_IMAGES
      ) {
        throw new Error(
          `You can upload a maximum of ${MAX_IMAGES} images.`,
        );
      }

      const formData =
        new FormData();

      formData.append(
        "organization",
        form.organization.trim(),
      );

      formData.append(
        "role",
        form.role.trim(),
      );

      formData.append(
        "responsibilities",
        form.responsibilities.trim(),
      );

      if (form.learned.trim()) {
        formData.append(
          "learned",
          form.learned.trim(),
        );
      }

      if (form.location.trim()) {
        formData.append(
          "location",
          form.location.trim(),
        );
      }

      formData.append(
        "employmentType",
        form.employmentType,
      );

      formData.append(
        "startDate",
        form.startDate,
      );

      if (
        !form.isCurrent &&
        form.endDate
      ) {
        formData.append(
          "endDate",
          form.endDate,
        );
      }

      formData.append(
        "isCurrent",
        String(form.isCurrent),
      );

      if (
        form.experienceLetterUrl.trim()
      ) {
        formData.append(
          "experienceLetterUrl",
          form.experienceLetterUrl.trim(),
        );
      }

      formData.append(
        "sortOrder",
        form.sortOrder || "0",
      );

      formData.append(
        "isActive",
        String(form.isActive),
      );

      selectedImages.forEach(
        (file) => {
          formData.append(
            "images",
            file,
          );
        },
      );

      const response =
        await callApi(
          "/experiences",
          "POST",
          formData,
          true,
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to create experience.",
        );
      }

      await reloadList?.();

      setSuccess(
        "Experience created successfully.",
      );

      clearImages();

      setForm(initialForm);
    } catch (error) {
      console.error(
        "Failed to create experience:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create experience.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="p-5 sm:p-7 lg:p-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <BriefcaseBusiness
                  size={20}
                  strokeWidth={1.5}
                  className="text-white/60"
                />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                  Create Experience
                </h1>

                <p className="mt-1 text-sm text-white/35">
                  Add a professional experience
                  to your portfolio.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3">
              <p className="text-sm leading-6 text-red-300">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  setError(null)
                }
                className="shrink-0 text-red-300/60 transition hover:text-red-300"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl border border-green-400/20 bg-green-500/5 px-4 py-3 text-sm text-green-300">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Organization
                </label>

                <input
                  type="text"
                  name="organization"
                  value={
                    form.organization
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Company or organization"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Role
                </label>

                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={
                    handleChange
                  }
                  placeholder="Full-Stack Developer"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={
                    handleChange
                  }
                  placeholder="Dhaka, Bangladesh"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Employment Type
                </label>

                <select
                  name="employmentType"
                  value={
                    form.employmentType
                  }
                  onChange={
                    handleChange
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-white/20 focus:bg-white/10"
                >
                  <option
                    value="FULL_TIME"
                    className="bg-slate-900"
                  >
                    Full Time
                  </option>

                  <option
                    value="PART_TIME"
                    className="bg-slate-900"
                  >
                    Part Time
                  </option>

                  <option
                    value="CONTRACT"
                    className="bg-slate-900"
                  >
                    Contract
                  </option>

                  <option
                    value="INTERNSHIP"
                    className="bg-slate-900"
                  >
                    Internship
                  </option>

                  <option
                    value="FREELANCE"
                    className="bg-slate-900"
                  >
                    Freelance
                  </option>

                  <option
                    value="TEMPORARY"
                    className="bg-slate-900"
                  >
                    Temporary
                  </option>

                  <option
                    value="OTHER"
                    className="bg-slate-900"
                  >
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-white/50">
                  <CalendarDays
                    size={15}
                  />
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={
                    form.startDate
                  }
                  onChange={
                    handleChange
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-white/20 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-white/50">
                  <CalendarDays
                    size={15}
                  />
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={
                    handleChange
                  }
                  disabled={
                    form.isCurrent
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-30 focus:border-white/20 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Sort Order
                </label>

                <input
                  type="number"
                  name="sortOrder"
                  min="0"
                  value={
                    form.sortOrder
                  }
                  onChange={
                    handleChange
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-white/20 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/50">
                  Experience Letter URL
                </label>

                <input
                  type="url"
                  name="experienceLetterUrl"
                  value={
                    form.experienceLetterUrl
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://..."
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/50">
                Responsibilities
              </label>

              <textarea
                name="responsibilities"
                value={
                  form.responsibilities
                }
                onChange={
                  handleChange
                }
                rows={8}
                placeholder="Describe your responsibilities and work..."
                className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/50">
                What I Learned
              </label>

              <textarea
                name="learned"
                value={form.learned}
                onChange={
                  handleChange
                }
                rows={6}
                placeholder="What did you learn from this experience?"
                className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/10"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                <input
                  type="checkbox"
                  name="isCurrent"
                  checked={
                    form.isCurrent
                  }
                  onChange={
                    handleChange
                  }
                  className="h-4 w-4 accent-white"
                />

                <div>
                  <p className="text-sm text-white/70">
                    Current Experience
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    This experience is
                    currently active.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    form.isActive
                  }
                  onChange={
                    handleChange
                  }
                  className="h-4 w-4 accent-white"
                />

                <div>
                  <p className="text-sm text-white/70">
                    Active
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Show this experience
                    in the portfolio.
                  </p>
                </div>
              </label>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <label className="block text-sm text-white/50">
                    Experience Images
                  </label>

                  <p className="mt-1 text-xs text-white/25">
                    Upload up to {MAX_IMAGES}{" "}
                    images.
                  </p>
                </div>

                {selectedImages.length >
                  0 && (
                  <span className="text-xs text-white/30">
                    {
                      selectedImages.length
                    }{" "}
                    / {MAX_IMAGES}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {previewImages.map(
                  (
                    image,
                    index,
                  ) => (
                    <div
                      key={image}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5"
                    >
                      <Image
                        src={image}
                        alt={`Experience image ${
                          index + 1
                        }`}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="200px"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
                            index,
                          )
                        }
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white/60 backdrop-blur-md transition hover:bg-red-500/20 hover:text-red-300"
                        title="Remove image"
                      >
                        <Trash2
                          size={15}
                          strokeWidth={
                            1.6
                          }
                        />
                      </button>
                    </div>
                  ),
                )}

                {selectedImages.length <
                  MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/5 text-white/30 transition hover:border-white/20 hover:bg-white/10 hover:text-white/60"
                  >
                    <ImagePlus
                      size={25}
                      strokeWidth={
                        1.5
                      }
                    />

                    <span className="text-xs">
                      Add Images
                    </span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleImageChange
                }
                className="hidden"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-7 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm text-white/50 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={1.6}
                />

                Clear
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-6 text-sm text-white/80 transition hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Creating...
                  </>
                ) : (
                  <>
                    <Save
                      size={16}
                      strokeWidth={1.6}
                    />

                    Create Experience
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}