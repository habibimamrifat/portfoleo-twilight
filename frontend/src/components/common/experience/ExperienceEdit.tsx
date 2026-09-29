"use client";

import Image from "next/image";
import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ImagePlus,
  Loader2,
  Save,
  X,
} from "lucide-react";

import Card from "@/components/common/util/Card";
import { getApi } from "@/api/getapi";
import { callApi } from "@/api/callApi";

type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE"
  | "TEMPORARY"
  | "OTHER";

interface Experience {
  id: string;
  organization: string;
  role: string;
  responsibilities: string;
  learned?: string | null;
  location?: string | null;
  images: string[];
  employmentType: EmploymentType | string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  experienceLetterUrl?: string | null;
  sortOrder: number;
  isActive?: boolean;
}

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

interface ExperienceEditProps {
  experienceId: string;
  reloadList?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface PreviewImage {
  file: File;
  url: string;
}

const EMPLOYMENT_TYPES: EmploymentType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
  "TEMPORARY",
  "OTHER",
];

const MAX_IMAGES = 10;

const emptyForm: ExperienceForm = {
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

function formatDateForInput(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getImageUrl(image?: string | null) {
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
}

function getResponseData(result: unknown): Experience | null {
  if (
    !result ||
    typeof result !== "object" ||
    Array.isArray(result)
  ) {
    return null;
  }

  const response = result as Record<string, unknown>;

  const candidates = [
    response.data,
    response.experience,
  ];

  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate)
    ) {
      const nested = candidate as Record<string, unknown>;

      if (
        nested.data &&
        typeof nested.data === "object" &&
        !Array.isArray(nested.data)
      ) {
        return nested.data as unknown as Experience;
      }

      if (nested.id) {
        return nested as unknown as Experience;
      }
    }
  }

  if (response.id) {
    return response as unknown as Experience;
  }

  return null;
}

export default function ExperienceEdit({
  experienceId,
  reloadList,
  onCancel,
}: ExperienceEditProps) {
  const [experience, setExperience] =
    useState<Experience | null>(null);

  const [form, setForm] =
    useState<ExperienceForm>(emptyForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  const [newImages, setNewImages] =
    useState<PreviewImage[]>([]);

  useEffect(() => {
    if (!experienceId) {
      return;
    }

    let cancelled = false;

    const fetchExperience = async () => {
      try {
        const response = await getApi(
          `/experiences/${experienceId}`,
          true,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to fetch experience.",
          );
        }

        const data = getResponseData(result);

        if (!data) {
          throw new Error(
            "Invalid experience response.",
          );
        }

        if (cancelled) {
          return;
        }

        setExperience(data);

        setForm({
          organization:
            data.organization ?? "",
          role:
            data.role ?? "",
          responsibilities:
            data.responsibilities ?? "",
          learned:
            data.learned ?? "",
          location:
            data.location ?? "",
          employmentType:
            (data.employmentType as EmploymentType) ??
            "FULL_TIME",
          startDate:
            formatDateForInput(
              data.startDate,
            ),
          endDate:
            formatDateForInput(
              data.endDate,
            ),
          isCurrent:
            Boolean(data.isCurrent),
          experienceLetterUrl:
            data.experienceLetterUrl ?? "",
          sortOrder:
            String(data.sortOrder ?? 0),
          isActive:
            data.isActive !== false,
        });

        setError(null);
        setLoading(false);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to fetch experience:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch experience.",
        );

        setLoading(false);
      }
    };

    void fetchExperience();

    return () => {
      cancelled = true;
    };
  }, [experienceId]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >,
  ) => {
    const { name, value } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, checked } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: checked,
      ...(name === "isCurrent" &&
      checked
        ? { endDate: "" }
        : {}),
    }));
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
      MAX_IMAGES -
      (experience?.images.length ?? 0) -
      newImages.length;

    if (availableSlots <= 0) {
      event.target.value = "";
      return;
    }

    const selectedFiles =
      files.slice(0, availableSlots);

    const previews =
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

    setNewImages((previous) => [
      ...previous,
      ...previews,
    ]);

    event.target.value = "";
  };

  const removeNewImage = (
    index: number,
  ) => {
    setNewImages((previous) => {
      const image = previous[index];

      if (image) {
        URL.revokeObjectURL(image.url);
      }

      return previous.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      );
    });
  };

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!experienceId) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

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
        form.sortOrder,
      );

      formData.append(
        "isActive",
        String(form.isActive),
      );

      newImages.forEach((image) => {
        formData.append(
          "images",
          image.file,
        );
      });

      const response =
        await callApi(
          `/experiences/${experienceId}`,
          "PATCH",
          formData,
          true,
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to update experience.",
        );
      }

      setSuccess(
        "Experience updated successfully.",
      );

      const updatedExperience =
        getResponseData(result);

      if (updatedExperience) {
        setExperience(
          updatedExperience,
        );
      }

      setNewImages((previous) => {
        previous.forEach((image) => {
          URL.revokeObjectURL(
            image.url,
          );
        });

        return [];
      });

      await reloadList?.();
    } catch (error) {
      console.error(
        "Failed to update experience:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update experience.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-6 py-5 text-sm text-white/50">
          <Loader2
            size={20}
            className="animate-spin"
          />

          <span>
            Loading experience...
          </span>
        </div>
      </div>
    );
  }

  if (error && !experience) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md">
        <Card className="relative w-full max-w-lg p-8">
          <button
            type="button"
            onClick={() =>
              onCancel?.()
            }
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
            title="Close"
          >
            <X
              size={20}
              strokeWidth={1.7}
            />
          </button>

          <BriefcaseBusiness
            size={32}
            strokeWidth={1.4}
            className="text-white/30"
          />

          <h2 className="mt-4 text-xl font-semibold text-white">
            Unable to load experience
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/40">
            {error}
          </p>
        </Card>
      </div>
    );
  }

  if (!experience) {
    return null;
  }

  const totalImages =
    experience.images.length +
    newImages.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md">
      <div className="relative flex h-full max-h-[calc(100vh-48px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
        <button
          type="button"
          onClick={() =>
            onCancel?.()
          }
          className="absolute right-4 top-4 z-[110] flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/60 text-white/60 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
          title="Close"
        >
          <X
            size={20}
            strokeWidth={1.7}
          />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <Card className="min-h-full rounded-none border-0 bg-transparent shadow-none">
            <form
              onSubmit={handleSubmit}
              className="space-y-8 p-6 sm:p-8 lg:p-10"
            >
              <div className="pr-14">
                <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
                  Experience
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Edit professional experience
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Update the information for{" "}
                  <span className="text-white/60">
                    {experience.organization}
                  </span>
                  .
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                    required
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/10"
                    placeholder="Company or organization"
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
                    required
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/10"
                    placeholder="Your role"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/50">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={
                      form.location
                    }
                    onChange={
                      handleChange
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/10"
                    placeholder="Dhaka, Bangladesh"
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
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-white/20"
                  >
                    {EMPLOYMENT_TYPES.map(
                      (type) => (
                        <option
                          key={type}
                          value={type}
                          className="bg-slate-900"
                        >
                          {type.replace(
                            /_/g,
                            " ",
                          )}
                        </option>
                      ),
                    )}
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
                    required
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-white/20"
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
                    value={
                      form.endDate
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      form.isCurrent
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-30 focus:border-white/20"
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
                  required
                  rows={6}
                  className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/10"
                  placeholder="Describe your responsibilities..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/50">
                  What You Learned
                </label>

                <textarea
                  name="learned"
                  value={form.learned}
                  onChange={
                    handleChange
                  }
                  rows={5}
                  className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/10"
                  placeholder="What did you learn from this experience?"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/10"
                    placeholder="https://..."
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
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <input
                    type="checkbox"
                    name="isCurrent"
                    checked={
                      form.isCurrent
                    }
                    onChange={
                      handleCheckboxChange
                    }
                    className="h-4 w-4 accent-blue-500"
                  />

                  <span>
                    <span className="block text-sm text-white/70">
                      Current Position
                    </span>

                    <span className="mt-1 block text-xs text-white/30">
                      This experience is ongoing.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={
                      form.isActive
                    }
                    onChange={
                      handleCheckboxChange
                    }
                    className="h-4 w-4 accent-blue-500"
                  />

                  <span>
                    <span className="block text-sm text-white/70">
                      Active Experience
                    </span>

                    <span className="mt-1 block text-xs text-white/30">
                      Active experiences appear publicly.
                    </span>
                  </span>
                </label>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <label className="block text-sm text-white/50">
                      Experience Images
                    </label>

                    <p className="mt-1 text-xs text-white/25">
                      {totalImages} /{" "}
                      {MAX_IMAGES} images
                    </p>
                  </div>

                  {totalImages <
                    MAX_IMAGES && (
                    <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white/50 transition hover:bg-white/10 hover:text-white">
                      <ImagePlus
                        size={16}
                        strokeWidth={1.6}
                      />

                      <span>
                        Add Images
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={
                          handleImageChange
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {totalImages > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {experience.images.map(
                      (
                        image,
                        index,
                      ) => {
                        const imageUrl =
                          getImageUrl(
                            image,
                          );

                        if (!imageUrl) {
                          return null;
                        }

                        return (
                          <div
                            key={`${image}-${index}`}
                            className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/5"
                          >
                            <Image
                              src={imageUrl}
                              alt={`Experience image ${
                                index + 1
                              }`}
                              fill
                              unoptimized
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, 25vw"
                            />

                            <div className="absolute left-2 top-2 rounded-lg border border-white/10 bg-black/50 px-2 py-1 text-[10px] text-white/60 backdrop-blur-md">
                              Existing
                            </div>
                          </div>
                        );
                      },
                    )}

                    {newImages.map(
                      (
                        image,
                        index,
                      ) => (
                        <div
                          key={image.url}
                          className="relative aspect-video overflow-hidden rounded-xl border border-blue-400/20 bg-white/5"
                        >
                          <Image
                            src={image.url}
                            alt={`New experience image ${
                              index + 1
                            }`}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, 25vw"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeNewImage(
                                index,
                              )
                            }
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white/60 backdrop-blur-md transition hover:bg-red-400/20 hover:text-white"
                            title="Remove image"
                          >
                            <X
                              size={16}
                              strokeWidth={1.7}
                            />
                          </button>

                          <div className="absolute bottom-2 left-2 rounded-lg border border-blue-400/20 bg-black/50 px-2 py-1 text-[10px] text-blue-300 backdrop-blur-md">
                            New
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
                    <div className="text-center">
                      <ImagePlus
                        size={24}
                        strokeWidth={1.4}
                        className="mx-auto text-white/20"
                      />

                      <p className="mt-2 text-xs text-white/30">
                        No images available
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t border-white/10 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Save
                      size={17}
                      strokeWidth={1.7}
                    />
                  )}

                  <span>
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </span>
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}