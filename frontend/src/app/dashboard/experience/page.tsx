"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  BriefcaseBusiness,
} from "lucide-react";

import Card from "@/components/common/util/Card";

import { getApi } from "@/api/getapi";
import { callApi } from "@/api/callApi";

const employmentTypes = [
  {
    value: "FULL_TIME",
    label: "Full Time",
  },
  {
    value: "PART_TIME",
    label: "Part Time",
  },
  {
    value: "CONTRACT",
    label: "Contract",
  },
  {
    value: "INTERNSHIP",
    label: "Internship",
  },
  {
    value: "FREELANCE",
    label: "Freelance",
  },
] as const;

type EmploymentType =
  (typeof employmentTypes)[number]["value"];

interface Experience {
  id: string;

  organization: string;

  role: string;

  responsibilities: string;

  learned?: string | null;

  location?: string | null;

  images: string[];

  employmentType: EmploymentType;

  startDate: string;

  endDate?: string | null;

  isCurrent: boolean;

  experienceLetterUrl?: string | null;

  sortOrder: number;

  isActive: boolean;
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

const MAX_IMAGES = 10;

export default function ExperiencePage() {
  const [experiences, setExperiences] =
    useState<Experience[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<ExperienceForm>(emptyForm);

  const [selectedImages, setSelectedImages] =
    useState<File[]>([]);

  const [previewImages, setPreviewImages] =
    useState<string[]>([]);

  /*
   * Existing images while editing.
   */
  const [existingImages, setExistingImages] =
    useState<string[]>([]);

  /*
   * Fetch experiences.
   */
  useEffect(() => {
    let cancelled = false;

    const fetchExperiences = async () => {
      try {
        const response =
          await getApi("/experiences");

        const result =
          await response.json();

        if (cancelled) {
          return;
        }

        const experienceData: Experience[] =
          Array.isArray(result)
            ? result
            : Array.isArray(result?.data)
              ? result.data
              : [];

        setExperiences(
          experienceData,
        );
      } catch (error) {
        console.error(
          "Failed to fetch experiences:",
          error,
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchExperiences();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Reset form.
   */
  const resetForm = () => {
    previewImages.forEach((image) => {
      URL.revokeObjectURL(image);
    });

    setForm({
      ...emptyForm,
    });

    setSelectedImages([]);

    setPreviewImages([]);

    setExistingImages([]);

    setEditingId(null);
  };

  /*
   * Open create modal.
   */
  const openCreateModal = () => {
    resetForm();

    setIsModalOpen(true);
  };

  /*
   * Open edit modal.
   */
  const openEditModal = (
    experience: Experience,
  ) => {
    setEditingId(experience.id);

    setForm({
      organization:
        experience.organization ?? "",

      role:
        experience.role ?? "",

      responsibilities:
        experience.responsibilities ?? "",

      learned:
        experience.learned ?? "",

      location:
        experience.location ?? "",

      employmentType:
        experience.employmentType ??
        "FULL_TIME",

      startDate:
        experience.startDate
          ? experience.startDate.slice(0, 10)
          : "",

      endDate:
        experience.endDate
          ? experience.endDate.slice(0, 10)
          : "",

      isCurrent:
        experience.isCurrent ?? false,

      experienceLetterUrl:
        experience.experienceLetterUrl ?? "",

      sortOrder:
        String(
          experience.sortOrder ?? 0,
        ),

      isActive:
        experience.isActive ?? true,
    });

    /*
     * Existing Cloudinary images.
     */
    setExistingImages(
      experience.images ?? [],
    );

    /*
     * New images start empty.
     */
    setSelectedImages([]);

    setPreviewImages([]);

    setIsModalOpen(true);
  };

  /*
   * Close modal.
   */
  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);

    resetForm();
  };

  /*
   * Input changes.
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >,
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  /*
   * Checkbox changes.
   */
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      name,
      checked,
    } = e.target;

    if (name === "isCurrent") {
      setForm((prev) => ({
        ...prev,

        isCurrent: checked,

        endDate: checked
          ? ""
          : prev.endDate,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,

      [name]: checked,
    }));
  };

  /*
   * Image selection.
   *
   * Every selected file gets:
   *
   * 1. Added to selectedImages
   * 2. Its own object URL
   * 3. Its own preview
   *
   * Additional selections are appended.
   */
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      e.target.files ?? [],
    );

    if (!files.length) {
      return;
    }

    setSelectedImages((prev) => {
      const remaining =
        MAX_IMAGES - prev.length;

      if (remaining <= 0) {
        return prev;
      }

      return [
        ...prev,
        ...files.slice(
          0,
          remaining,
        ),
      ];
    });

    setPreviewImages((prev) => {
      const remaining =
        MAX_IMAGES - prev.length;

      if (remaining <= 0) {
        return prev;
      }

      const newFiles =
        files.slice(
          0,
          remaining,
        );

      const newPreviews =
        newFiles.map((file) =>
          URL.createObjectURL(file),
        );

      return [
        ...prev,
        ...newPreviews,
      ];
    });

    /*
     * Allows selecting the same file again.
     */
    e.target.value = "";
  };

  /*
   * Remove one newly selected image.
   */
  const removeSelectedImage = (
    index: number,
  ) => {
    const preview =
      previewImages[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedImages((prev) =>
      prev.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      ),
    );

    setPreviewImages((prev) =>
      prev.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      ),
    );
  };

  /*
   * Remove an existing image from the
   * frontend edit list.
   *
   * This only removes it from the local
   * list for now.
   */
  const removeExistingImage = (
    index: number,
  ) => {
    setExistingImages((prev) =>
      prev.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      ),
    );
  };

  /*
   * Submit experience.
   */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!form.organization.trim()) {
      alert(
        "Organization is required.",
      );

      return;
    }

    if (!form.role.trim()) {
      alert("Role is required.");

      return;
    }

    if (
      !form.responsibilities.trim()
    ) {
      alert(
        "Responsibilities are required.",
      );

      return;
    }

    if (!form.startDate) {
      alert(
        "Start date is required.",
      );

      return;
    }

    setSaving(true);

    try {
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

      /*
       * Employment type.
       *
       * FULL_TIME
       * PART_TIME
       * CONTRACT
       * INTERNSHIP
       * FREELANCE
       */
      formData.append(
        "employmentType",
        form.employmentType,
      );

      formData.append(
        "startDate",
        form.startDate,
      );

      if (
        form.endDate &&
        !form.isCurrent
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
        String(
          Number(form.sortOrder) || 0,
        ),
      );

      formData.append(
        "isActive",
        String(form.isActive),
      );

      /*
       * Append every selected image.
       */
      selectedImages.forEach(
        (image) => {
          formData.append(
            "images",
            image,
          );
        },
      );

      const url = editingId
        ? `/experiences/${editingId}`
        : "/experiences";

      const method = editingId
        ? "PATCH"
        : "POST";

      const response =
        await callApi(
          url,
          method,
          formData,
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
                "Failed to save experience",
        );
      }

      const savedExperience: Experience =
        result?.data ?? result;

      if (editingId) {
        setExperiences(
          (prev) =>
            prev.map(
              (experience) =>
                experience.id ===
                editingId
                  ? savedExperience
                  : experience,
            ),
        );
      } else {
        setExperiences(
          (prev) => [
            savedExperience,
            ...prev,
          ],
        );
      }

      setIsModalOpen(false);

      resetForm();
    } catch (error) {
      console.error(
        "Failed to save experience:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save experience",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Delete.
   */
  const handleDelete = async (
    id: string,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this experience?",
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await callApi(
          `/experiences/${id}`,
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

      setExperiences(
        (prev) =>
          prev.filter(
            (experience) =>
              experience.id !== id,
          ),
      );
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
    }
  };

  /*
   * Employment label.
   */
  const getEmploymentLabel = (
    type: EmploymentType,
  ) => {
    return (
      employmentTypes.find(
        (employment) =>
          employment.value === type,
      )?.label ?? type
    );
  };

  return (
    <div className="min-h-full space-y-6 pb-10">
      {/* Header */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Experience
          </h1>

          <p className="mt-1 text-sm text-white/50">
            Manage your professional
            experience.
          </p>
        </div>

        <button
          type="button"
          onClick={
            openCreateModal
          }
          className="
            flex items-center gap-2
            rounded-2xl
            border border-white/20
            bg-white/10
            px-4 py-2.5
            text-sm text-white
            backdrop-blur-xs
            transition-all
            duration-300
            hover:bg-white/15
          "
        >
          <Plus size={17} />

          Add Experience
        </button>
      </div>

      {/* Experience List */}

      {loading ? (
        <div className="py-20 text-center text-sm text-white/40">
          Loading experiences...
        </div>
      ) : experiences.length === 0 ? (
        <Card className="p-10">
          <div className="flex flex-col items-center justify-center text-center">
            <BriefcaseBusiness
              size={38}
              strokeWidth={1.3}
              className="text-white/30"
            />

            <h2 className="mt-4 text-lg text-white">
              No experience added
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Add your professional
              experience to display it
              on your portfolio.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map(
            (experience) => (
              <Card
                key={experience.id}
                className="p-5 backdrop-blur-xs"
              >
                <div className="flex flex-col gap-5 lg:flex-row">
                  {/* Images */}

                  {experience.images?.length >
                    0 && (
                    <div className="flex shrink-0 gap-2">
                      {experience.images
                        .slice(0, 3)
                        .map(
                          (
                            image,
                            index,
                          ) => (
                            <div
                              key={`${image}-${index}`}
                              className="
                                relative
                                h-24 w-24
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/10
                              "
                            >
                              <Image
                                src={image}
                                alt={`${experience.organization} ${
                                  index + 1
                                }`}
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            </div>
                          ),
                        )}
                    </div>
                  )}

                  {/* Content */}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-medium text-white">
                            {
                              experience.role
                            }
                          </h2>

                          {experience.isCurrent && (
                            <span
                              className="
                                rounded-full
                                border
                                border-white/15
                                bg-white/10
                                px-2 py-0.5
                                text-[10px]
                                text-white/70
                              "
                            >
                              Current
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-white/60">
                          {
                            experience.organization
                          }
                        </p>
                      </div>

                      {/* Actions */}

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              experience,
                            )
                          }
                          className="
                            flex h-9 w-9
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/10
                            text-white/50
                            transition-all
                            hover:bg-white/10
                            hover:text-white
                          "
                          title="Edit"
                        >
                          <Pencil
                            size={15}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              experience.id,
                            )
                          }
                          className="
                            flex h-9 w-9
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/10
                            text-white/50
                            transition-all
                            hover:bg-white/10
                            hover:text-white
                          "
                          title="Delete"
                        >
                          <Trash2
                            size={15}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Meta */}

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/40">
                      {experience.location && (
                        <span>
                          {
                            experience.location
                          }
                        </span>
                      )}

                      <span>
                        {getEmploymentLabel(
                          experience.employmentType,
                        )}
                      </span>

                      <span>
                        {new Date(
                          experience.startDate,
                        ).toLocaleDateString(
                          "en-US",
                          {
                            month:
                              "short",
                            year:
                              "numeric",
                          },
                        )}

                        {" — "}

                        {experience.isCurrent
                          ? "Present"
                          : experience.endDate
                            ? new Date(
                                experience.endDate,
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  month:
                                    "short",
                                  year:
                                    "numeric",
                                },
                              )
                            : "—"}
                      </span>
                    </div>

                    {/* Responsibilities */}

                    <p className="mt-4 whitespace-pre-line text-sm leading-6 text-white/60">
                      {
                        experience.responsibilities
                      }
                    </p>

                    {/* Learned */}

                    {experience.learned && (
                      <div className="mt-4">
                        <p className="text-xs uppercase tracking-wider text-white/30">
                          Learned
                        </p>

                        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-white/50">
                          {
                            experience.learned
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ),
          )}
        </div>
      )}

      {/* Modal */}

      {isModalOpen && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center
            justify-center
            bg-black/60
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              relative
              flex
              max-h-[90vh]
              w-full
              max-w-4xl
              flex-col
              overflow-hidden
              rounded-3xl
              border
              border-white/20
              bg-white/5
              shadow-[0_25px_80px_rgba(0,0,0,0.55)]
              backdrop-blur-2xl
            "
          >
            {/* Modal Header */}

            <div
              className="
                flex shrink-0
                items-center
                justify-between
                border-b
                border-white/10
                px-6 py-4
              "
            >
              <div>
                <h2 className="text-lg font-medium text-white">
                  {editingId
                    ? "Edit Experience"
                    : "Add Experience"}
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  Add your professional
                  experience details.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                className="
                  flex h-9 w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  text-white/50
                  transition-all
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <X size={17} />
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={
                handleSubmit
              }
              className="
                min-h-0
                overflow-y-auto
              "
            >
              <div className="grid gap-5 p-6 md:grid-cols-2">
                {/* Organization */}

                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Organization
                  </label>

                  <input
                    required
                    name="organization"
                    value={
                      form.organization
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Company name"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      px-4 py-3
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-white/25
                      focus:border-white/30
                    "
                  />
                </div>

                {/* Role */}

                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Role
                  </label>

                  <input
                    required
                    name="role"
                    value={
                      form.role
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Full-Stack Developer"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      px-4 py-3
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-white/25
                      focus:border-white/30
                    "
                  />
                </div>

                {/* Location */}

                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Location
                  </label>

                  <input
                    name="location"
                    value={
                      form.location
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Dhaka, Bangladesh"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      px-4 py-3
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-white/25
                      focus:border-white/30
                    "
                  />
                </div>

                {/* Employment Type */}

                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Employment Type
                  </label>

                  <select
                    required
                    name="employmentType"
                    value={
                      form.employmentType
                    }
                    onChange={
                      handleChange
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-black/30
                      px-4 py-3
                      text-sm
                      text-white
                      outline-none
                      transition
                      focus:border-white/30
                    "
                  >
                    {employmentTypes.map(
                      (type) => (
                        <option
                          key={
                            type.value
                          }
                          value={
                            type.value
                          }
                          className="
                            bg-black
                            text-white
                          "
                        >
                          {
                            type.label
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {/* Start Date */}

                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Start Date
                  </label>

                  <input
                    required
                    type="date"
                    name="startDate"
                    value={
                      form.startDate
                    }
                    onChange={
                      handleChange
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      px-4 py-3
                      text-sm
                      text-white
                      outline-none
                      transition
                      focus:border-white/30
                    "
                  />
                </div>

                {/* End Date */}

                <div>
                  <label className="mb-2 block text-xs text-white/50">
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
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      px-4 py-3
                      text-sm
                      text-white
                      outline-none
                      transition
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                  />
                </div>

                {/* Responsibilities */}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs text-white/50">
                    Responsibilities
                  </label>

                  <textarea
                    required
                    name="responsibilities"
                    value={
                      form.responsibilities
                    }
                    onChange={
                      handleChange
                    }
                    rows={5}
                    placeholder="Describe your responsibilities..."
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      px-4 py-3
                      text-sm
                      leading-6
                      text-white
                      outline-none
                      transition
                      placeholder:text-white/25
                      focus:border-white/30
                    "
                  />
                </div>

                {/* Learned */}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs text-white/50">
                    What I Learned
                  </label>

                  <textarea
                    name="learned"
                    value={
                      form.learned
                    }
                    onChange={
                      handleChange
                    }
                    rows={4}
                    placeholder="What skills, lessons, or experience did you gain?"
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      px-4 py-3
                      text-sm
                      leading-6
                      text-white
                      outline-none
                      transition
                      placeholder:text-white/25
                      focus:border-white/30
                    "
                  />
                </div>

                {/* Experience Letter */}

                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Experience Letter URL
                  </label>

                  <input
                    name="experienceLetterUrl"
                    value={
                      form.experienceLetterUrl
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://..."
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      px-4 py-3
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-white/25
                      focus:border-white/30
                    "
                  />
                </div>

                {/* Sort Order */}

                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Sort Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="sortOrder"
                    value={
                      form.sortOrder
                    }
                    onChange={
                      handleChange
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      px-4 py-3
                      text-sm
                      text-white
                      outline-none
                      transition
                      focus:border-white/30
                    "
                  />
                </div>

                {/* Current / Active */}

                <div className="flex flex-wrap items-center gap-5 md:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-white/60">
                    <input
                      type="checkbox"
                      name="isCurrent"
                      checked={
                        form.isCurrent
                      }
                      onChange={
                        handleCheckboxChange
                      }
                      className="h-4 w-4 accent-white"
                    />

                    Currently working here
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 text-sm text-white/60">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={
                        form.isActive
                      }
                      onChange={
                        handleCheckboxChange
                      }
                      className="h-4 w-4 accent-white"
                    />

                    Active
                  </label>
                </div>

                {/* Images */}

                <div className="md:col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-xs text-white/50">
                      Images
                    </label>

                    <span className="text-xs text-white/30">
                      {
                        selectedImages.length
                      }
                      /
                      {MAX_IMAGES}{" "}
                      new
                    </span>
                  </div>

                  {/* Upload */}

                  <label
                    className={`
                      flex
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      border
                      border-dashed
                      border-white/15
                      bg-white/5
                      px-6 py-8
                      text-center
                      transition
                      hover:bg-white/10
                      ${
                        selectedImages.length >=
                        MAX_IMAGES
                          ? "pointer-events-none opacity-40"
                          : ""
                      }
                    `}
                  >
                    <Upload
                      size={22}
                      className="text-white/40"
                    />

                    <span className="text-sm text-white/60">
                      Click to upload images
                    </span>

                    <span className="text-xs text-white/30">
                      Select up to{" "}
                      {MAX_IMAGES} images
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={
                        handleImageChange
                      }
                      disabled={
                        selectedImages.length >=
                        MAX_IMAGES
                      }
                      className="hidden"
                    />
                  </label>

                  {/* Existing Images */}

                  {editingId &&
                    existingImages.length >
                      0 && (
                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs text-white/50">
                            Existing
                            Images
                          </p>

                          <span className="text-xs text-white/30">
                            {
                              existingImages.length
                            }
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
                          {existingImages.map(
                            (
                              image,
                              index,
                            ) => (
                              <div
                                key={`${image}-${index}`}
                                className="
                                  group
                                  relative
                                  aspect-square
                                  overflow-hidden
                                  rounded-2xl
                                  border
                                  border-white/10
                                "
                              >
                                <Image
                                  src={image}
                                  alt={`Existing image ${
                                    index +
                                    1
                                  }`}
                                  fill
                                  sizes="(max-width: 640px) 50vw, 20vw"
                                  className="object-cover"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeExistingImage(
                                      index,
                                    )
                                  }
                                  className="
                                    absolute
                                    right-2
                                    top-2
                                    z-10
                                    flex
                                    h-7 w-7
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-black/60
                                    text-white
                                    backdrop-blur-sm
                                    transition
                                    hover:bg-black/80
                                  "
                                  title="Remove image"
                                >
                                  <X
                                    size={
                                      14
                                    }
                                  />
                                </button>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* New Image Previews */}

                  {previewImages.length >
                    0 && (
                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs text-white/50">
                          New Images
                        </p>

                        <span className="text-xs text-white/30">
                          {
                            previewImages.length
                          }
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
                        {previewImages.map(
                          (
                            image,
                            index,
                          ) => (
                            <div
                              key={`${image}-${index}`}
                              className="
                                group
                                relative
                                aspect-square
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/10
                              "
                            >
                              <Image
                                src={image}
                                alt={`Selected image ${
                                  index +
                                  1
                                }`}
                                fill
                                sizes="(max-width: 640px) 50vw, 20vw"
                                className="object-cover"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeSelectedImage(
                                    index,
                                  )
                                }
                                className="
                                  absolute
                                  right-2
                                  top-2
                                  z-10
                                  flex
                                  h-7 w-7
                                  items-center
                                  justify-center
                                  rounded-lg
                                  bg-black/60
                                  text-white
                                  backdrop-blur-sm
                                  transition
                                  hover:bg-black/80
                                "
                                title="Remove image"
                              >
                                <X
                                  size={
                                    14
                                  }
                                />
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {editingId && (
                    <p className="mt-3 text-xs text-white/30">
                      New images are
                      uploaded and
                      appended to
                      existing images.
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}

              <div
                className="
                  flex shrink-0
                  justify-end
                  gap-3
                  border-t
                  border-white/10
                  px-6 py-4
                "
              >
                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={saving}
                  className="
                    rounded-xl
                    border
                    border-white/10
                    px-5 py-2.5
                    text-sm
                    text-white/60
                    transition
                    hover:bg-white/10
                    disabled:opacity-30
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    rounded-xl
                    border
                    border-white/20
                    bg-white/10
                    px-5 py-2.5
                    text-sm
                    text-white
                    backdrop-blur-xs
                    transition
                    hover:bg-white/15
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Experience"
                      : "Create Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}