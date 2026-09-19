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
import Card from "@/components/common/Card";



const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
];

interface Experience {
  id: string;
  organization: string;
  role: string;
  responsibilities: string;
  learned?: string | null;
  location?: string | null;
  images: string[];
  employmentType: string;
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
  employmentType: string;
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

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<ExperienceForm>(emptyForm);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("portfolio")
      : null;

  useEffect(() => {
    let cancelled = false;

    const fetchExperiences = async () => {
      try {
        const response = await fetch(`${API_URL}/experiences`);

        const result = await response.json();

        if (cancelled) return;

        const experienceData: Experience[] = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        setExperiences(experienceData);
      } catch (error) {
        console.error("Failed to fetch experiences:", error);
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

  const resetForm = () => {
    previewImages.forEach((image) => {
      URL.revokeObjectURL(image);
    });

    setForm(emptyForm);
    setSelectedImages([]);
    setPreviewImages([]);
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (experience: Experience) => {
    setEditingId(experience.id);

    setForm({
      organization: experience.organization ?? "",
      role: experience.role ?? "",
      responsibilities: experience.responsibilities ?? "",
      learned: experience.learned ?? "",
      location: experience.location ?? "",
      employmentType: experience.employmentType ?? "FULL_TIME",
      startDate: experience.startDate
        ? experience.startDate.slice(0, 10)
        : "",
      endDate: experience.endDate
        ? experience.endDate.slice(0, 10)
        : "",
      isCurrent: experience.isCurrent ?? false,
      experienceLetterUrl: experience.experienceLetterUrl ?? "",
      sortOrder: String(experience.sortOrder ?? 0),
      isActive: experience.isActive ?? true,
    });

    setSelectedImages([]);
    setPreviewImages([]);

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));

    if (name === "isCurrent" && checked) {
      setForm((prev) => ({
        ...prev,
        isCurrent: true,
        endDate: "",
      }));
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files ?? []);

    if (!files.length) return;

    previewImages.forEach((image) => {
      URL.revokeObjectURL(image);
    });

    setSelectedImages(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file),
    );

    setPreviewImages(previews);

    e.target.value = "";
  };

  const removeSelectedImage = (index: number) => {
    const preview = previewImages[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedImages((prev) =>
      prev.filter((_, i) => i !== index),
    );

    setPreviewImages((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!token) {
      alert("You are not authenticated.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("organization", form.organization);
      formData.append("role", form.role);
      formData.append(
        "responsibilities",
        form.responsibilities,
      );

      if (form.learned.trim()) {
        formData.append("learned", form.learned);
      }

      if (form.location.trim()) {
        formData.append("location", form.location);
      }

      formData.append(
        "employmentType",
        form.employmentType,
      );

      formData.append("startDate", form.startDate);

      if (form.endDate && !form.isCurrent) {
        formData.append("endDate", form.endDate);
      }

      formData.append(
        "isCurrent",
        String(form.isCurrent),
      );

      if (form.experienceLetterUrl.trim()) {
        formData.append(
          "experienceLetterUrl",
          form.experienceLetterUrl,
        );
      }

      formData.append(
        "sortOrder",
        String(Number(form.sortOrder) || 0),
      );

      formData.append(
        "isActive",
        String(form.isActive),
      );

      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      const url = editingId
        ? `${API_URL}/experiences/${editingId}`
        : `${API_URL}/experiences`;

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to save experience",
        );
      }

      const savedExperience: Experience =
        result?.data ?? result;

      if (editingId) {
        setExperiences((prev) =>
          prev.map((experience) =>
            experience.id === editingId
              ? savedExperience
              : experience,
          ),
        );
      } else {
        setExperiences((prev) => [
          savedExperience,
          ...prev,
        ]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save experience:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save experience",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) {
      alert("You are not authenticated.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/experiences/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to delete experience",
        );
      }

      setExperiences((prev) =>
        prev.filter(
          (experience) => experience.id !== id,
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

  return (
    <div className="min-h-full space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Experience
          </h1>

          <p className="mt-1 text-sm text-white/50">
            Manage your professional experience.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="
            flex items-center gap-2 rounded-2xl
            border border-white/20 bg-white/10
            px-4 py-2.5 text-sm text-white
            backdrop-blur-xs transition-all duration-300
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
              Add your professional experience to
              display it on your portfolio.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <Card
              key={experience.id}
              className="p-5 backdrop-blur-xs"
            >
              <div className="flex flex-col gap-5 lg:flex-row">
                {/* Images */}
                {experience.images?.length > 0 && (
                  <div className="flex shrink-0 gap-2">
                    {experience.images
                      .slice(0, 3)
                      .map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="
                            relative h-24 w-24
                            overflow-hidden rounded-2xl
                            border border-white/10
                          "
                        >
                          <Image
                            src={image}
                            alt={`${experience.organization} ${index + 1}`}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                  </div>
                )}

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-medium text-white">
                          {experience.role}
                        </h2>

                        {experience.isCurrent && (
                          <span
                            className="
                              rounded-full border border-white/15
                              bg-white/10 px-2 py-0.5
                              text-[10px] text-white/70
                            "
                          >
                            Current
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-white/60">
                        {experience.organization}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(experience)
                        }
                        className="
                          flex h-9 w-9 items-center
                          justify-center rounded-xl
                          border border-white/10
                          text-white/50
                          transition-all
                          hover:bg-white/10
                          hover:text-white
                        "
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(experience.id)
                        }
                        className="
                          flex h-9 w-9 items-center
                          justify-center rounded-xl
                          border border-white/10
                          text-white/50
                          transition-all
                          hover:bg-white/10
                          hover:text-white
                        "
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/40">
                    {experience.location && (
                      <span>
                        {experience.location}
                      </span>
                    )}

                    <span>
                      {experience.employmentType.replaceAll(
                        "_",
                        " ",
                      )}
                    </span>

                    <span>
                      {new Date(
                        experience.startDate,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                      {" — "}
                      {experience.isCurrent
                        ? "Present"
                        : experience.endDate
                          ? new Date(
                              experience.endDate,
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                    </span>
                  </div>

                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-white/60">
                    {experience.responsibilities}
                  </p>

                  {experience.learned && (
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-wider text-white/30">
                        Learned
                      </p>

                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-white/50">
                        {experience.learned}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="
            fixed inset-0 z-50 flex items-center
            justify-center bg-black/60 p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              relative flex max-h-[90vh] w-full
              max-w-4xl flex-col overflow-hidden
              rounded-3xl border border-white/20
              bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.55)]
              backdrop-blur-2xl
            "
          >
            {/* Modal Header */}
            <div
              className="
                flex shrink-0 items-center justify-between
                border-b border-white/10 px-6 py-4
              "
            >
              <div>
                <h2 className="text-lg font-medium text-white">
                  {editingId
                    ? "Edit Experience"
                    : "Add Experience"}
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  Add your professional experience details.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="
                  flex h-9 w-9 items-center
                  justify-center rounded-xl
                  border border-white/10
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
              onSubmit={handleSubmit}
              className="min-h-0 overflow-y-auto"
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
                    value={form.organization}
                    onChange={handleChange}
                    placeholder="Company name"
                    className="
                      w-full rounded-xl border border-white/10
                      bg-white/5 px-4 py-3 text-sm text-white
                      outline-none transition
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
                    value={form.role}
                    onChange={handleChange}
                    placeholder="Full-Stack Developer"
                    className="
                      w-full rounded-xl border border-white/10
                      bg-white/5 px-4 py-3 text-sm text-white
                      outline-none transition
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
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Dhaka, Bangladesh"
                    className="
                      w-full rounded-xl border border-white/10
                      bg-white/5 px-4 py-3 text-sm text-white
                      outline-none transition
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
                    value={form.employmentType}
                    onChange={handleChange}
                    className="
                      w-full rounded-xl border border-white/10
                      bg-black/30 px-4 py-3 text-sm text-white
                      outline-none transition
                      focus:border-white/30
                    "
                  >
                    {employmentTypes.map((type) => (
                      <option
                        key={type}
                        value={type}
                        className="bg-black text-white"
                      >
                        {type.replaceAll("_", " ")}
                      </option>
                    ))}
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
                    value={form.startDate}
                    onChange={handleChange}
                    className="
                      w-full rounded-xl border border-white/10
                      bg-white/5 px-4 py-3 text-sm text-white
                      outline-none transition
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
                    value={form.endDate}
                    onChange={handleChange}
                    disabled={form.isCurrent}
                    className="
                      w-full rounded-xl border border-white/10
                      bg-white/5 px-4 py-3 text-sm text-white
                      outline-none transition
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
                    value={form.responsibilities}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your responsibilities..."
                    className="
                      w-full resize-none rounded-xl
                      border border-white/10 bg-white/5
                      px-4 py-3 text-sm leading-6 text-white
                      outline-none transition
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
                    value={form.learned}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What skills, lessons, or experience did you gain?"
                    className="
                      w-full resize-none rounded-xl
                      border border-white/10 bg-white/5
                      px-4 py-3 text-sm leading-6 text-white
                      outline-none transition
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
                    value={form.experienceLetterUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="
                      w-full rounded-xl border border-white/10
                      bg-white/5 px-4 py-3 text-sm text-white
                      outline-none transition
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
                    value={form.sortOrder}
                    onChange={handleChange}
                    className="
                      w-full rounded-xl border border-white/10
                      bg-white/5 px-4 py-3 text-sm text-white
                      outline-none transition
                      focus:border-white/30
                    "
                  />
                </div>

                {/* Status */}
                <div className="flex flex-wrap items-center gap-5 md:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-white/60">
                    <input
                      type="checkbox"
                      name="isCurrent"
                      checked={form.isCurrent}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-white"
                    />
                    Currently working here
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 text-sm text-white/60">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 accent-white"
                    />
                    Active
                  </label>
                </div>

                {/* Images */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs text-white/50">
                    Images
                  </label>

                  <label
                    className="
                      flex cursor-pointer flex-col
                      items-center justify-center gap-2
                      rounded-2xl border border-dashed
                      border-white/15 bg-white/5
                      px-6 py-8 text-center
                      transition hover:bg-white/10
                    "
                  >
                    <Upload
                      size={22}
                      className="text-white/40"
                    />

                    <span className="text-sm text-white/60">
                      Click to upload images
                    </span>

                    <span className="text-xs text-white/30">
                      You can select multiple images
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {/* Image Previews */}
                  {previewImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {previewImages.map(
                        (image, index) => (
                          <div
                            key={image}
                            className="
                              group relative aspect-square
                              overflow-hidden rounded-2xl
                              border border-white/10
                            "
                          >
                            <Image
                              src={image}
                              alt={`Preview ${index + 1}`}
                              fill
                              sizes="(max-width: 640px) 50vw, 25vw"
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
                                absolute right-2 top-2 z-10
                                flex h-7 w-7 items-center
                                justify-center rounded-lg
                                bg-black/60 text-white
                                backdrop-blur-sm
                              "
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {editingId && (
                    <p className="mt-3 text-xs text-white/30">
                      New images will be appended to
                      the existing images.
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div
                className="
                  flex shrink-0 justify-end gap-3
                  border-t border-white/10 px-6 py-4
                "
              >
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    rounded-xl border border-white/10
                    px-5 py-2.5 text-sm text-white/60
                    transition hover:bg-white/10
                    disabled:opacity-30
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    rounded-xl border border-white/20
                    bg-white/10 px-5 py-2.5
                    text-sm text-white
                    backdrop-blur-xs
                    transition hover:bg-white/15
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