"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Pencil,
  Plus,
  Trash2,
  X,
  Upload,
  ExternalLink,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { getApi } from "@/api/getapi";
import { callApi } from "@/api/callApi";

type Project = {
  id: string;
  name: string;
  description: string;
  images: string[];
  liveLink?: string | null;
  githubLink?: string | null;
  status?: string | null;
  platform?: string | null;
  approachTaken?: string | null;
  featured?: boolean;
  sortOrder?: number;
};

type ProjectForm = {
  name: string;
  description: string;
  liveLink: string;
  githubLink: string;
  status: string;
  platform: string;
  approachTaken: string;
  featured: boolean;
  sortOrder: number;
};

const MAX_IMAGES = 10;

const initialForm: ProjectForm = {
  name: "",
  description: "",
  liveLink: "",
  githubLink: "",
  status: "",
  platform: "",
  approachTaken: "",
  featured: false,
  sortOrder: 0,
};

/*
 * These values MUST match the backend DTO enums.
 */
const statusOptions = [
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    label: "Developed",
    value: "DEVELOPED",
  },
  {
    label: "Discontinued",
    value: "DISCONTINUED",
  },
];

const platformOptions = [
  {
    label: "Website",
    value: "WEBSITE",
  },
  {
    label: "Mobile",
    value: "MOBILE",
  },
  {
    label: "Backend",
    value: "BACKEND",
  },
  {
    label: "Desktop",
    value: "DESKTOP",
  },
  {
    label: "API",
    value: "API",
  },
  {
    label: "Other",
    value: "OTHER",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<ProjectForm>(initialForm);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      setError("");

      const response = await getApi("/projects");

      if (!response.ok) {
        throw new Error("Failed to load projects.");
      }

      const result = await response.json();

      setProjects(result?.data ?? result ?? []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load projects.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /*
   * Delayed execution avoids the
   * react-hooks/set-state-in-effect lint error.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchProjects();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [fetchProjects]);

  function clearSelectedImages() {
    imagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    setSelectedImages([]);
    setImagePreviews([]);
  }

  function resetForm() {
    clearSelectedImages();

    setForm(initialForm);
    setEditingId(null);
    setExistingImages([]);
    setError("");
    setIsFormOpen(false);
  }

  function startCreate() {
    clearSelectedImages();

    setForm(initialForm);
    setEditingId(null);
    setExistingImages([]);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  }

  function startEdit(project: Project) {
    clearSelectedImages();

    setEditingId(project.id);

    setForm({
      name: project.name ?? "",
      description: project.description ?? "",
      liveLink: project.liveLink ?? "",
      githubLink: project.githubLink ?? "",
      status: project.status ?? "",
      platform: project.platform ?? "",
      approachTaken: project.approachTaken ?? "",
      featured: project.featured ?? false,
      sortOrder: project.sortOrder ?? 0,
    });

    setExistingImages(project.images ?? []);

    setError("");
    setSuccess("");
    setIsFormOpen(true);
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const checked = (
        event.target as HTMLInputElement
      ).checked;

      setForm((previous) => ({
        ...previous,
        [name]: checked,
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "sortOrder"
          ? Number(value)
          : value,
    }));
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
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
        `You can select a maximum of ${MAX_IMAGES} images.`,
      );

      event.target.value = "";
      return;
    }

    const acceptedFiles = files.slice(
      0,
      availableSlots,
    );

    const rejectedCount =
      files.length - acceptedFiles.length;

    const newPreviews = acceptedFiles.map(
      (file) => URL.createObjectURL(file),
    );

    setSelectedImages((previous) => [
      ...previous,
      ...acceptedFiles,
    ]);

    setImagePreviews((previous) => [
      ...previous,
      ...newPreviews,
    ]);

    if (rejectedCount > 0) {
      setError(
        `Only ${MAX_IMAGES} images can be selected.`,
      );
    } else {
      setError("");
    }

    /*
     * Allows the same file to be selected again
     * in a future picker interaction.
     */
    event.target.value = "";
  }

  function removeSelectedImage(index: number) {
    const preview = imagePreviews[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedImages((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      ),
    );

    setImagePreviews((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index,
      ),
    );

    setError("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Project description is required.");
      return;
    }

    if (!form.status) {
      setError("Please select a project status.");
      return;
    }

    if (!form.platform) {
      setError("Please select a project platform.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      /*
       * Text fields
       */
      formData.append("name", form.name.trim());

      formData.append(
        "description",
        form.description.trim(),
      );

      /*
       * Optional fields.
       * Only append when they contain a value.
       */
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

      if (form.approachTaken.trim()) {
        formData.append(
          "approachTaken",
          form.approachTaken.trim(),
        );
      }

      /*
       * Backend enum values.
       *
       * status:
       * IN_PROGRESS
       * DEVELOPED
       * DISCONTINUED
       *
       * platform:
       * WEBSITE
       * MOBILE
       * BACKEND
       * DESKTOP
       * API
       * OTHER
       */
      formData.append("status", form.status);
      formData.append("platform", form.platform);

      /*
       * Boolean and number fields are converted to strings
       * because this is multipart/form-data.
       */
      formData.append(
        "featured",
        String(form.featured),
      );

      formData.append(
        "sortOrder",
        String(form.sortOrder),
      );

      /*
       * Append EVERY selected image using the same
       * field name expected by FilesInterceptor:
       *
       * FilesInterceptor('images', 10)
       */
      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      const url = editingId
        ? `/projects/${editingId}`
        : "/projects";

      const method = editingId
        ? "PATCH"
        : "POST";

      const response = await callApi(
        url,
        method,
        formData,
        true,
      );

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Failed to save project.",
        );
      }

      setSuccess(
        editingId
          ? "Project updated successfully."
          : "Project created successfully.",
      );

      clearSelectedImages();

      setForm(initialForm);
      setEditingId(null);
      setExistingImages([]);
      setIsFormOpen(false);

      await fetchProjects();
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
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const response = await callApi(
        `/projects/${id}`,
        "DELETE",
        undefined,
        true,
      );

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Failed to delete project.",
        );
      }

      setSuccess(
        "Project deleted successfully.",
      );

      await fetchProjects();
    } catch (error) {
      console.error(
        "Failed to delete project:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete project.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Projects
          </h1>

          <p className="mt-1 text-sm text-white/60">
            Manage the projects displayed on your
            portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/15"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {/* Error */}
      {error && !isFormOpen && (
        <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Success */}
      {success && !isFormOpen && (
        <div className="rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {success}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60 backdrop-blur-md">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
          <p className="text-white/60">
            No projects found.
          </p>

          <button
            type="button"
            onClick={startCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15"
          >
            <Plus size={16} />
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
            >
              {/* Image */}
              <div className="relative h-52 w-full overflow-hidden bg-black/20">
                {project.images?.[0] ? (
                  <Image
                    src={project.images[0]}
                    alt={project.name}
                    fill
                    className="object-cover transition duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-white/40">
                    No image
                  </div>
                )}

                {project.featured && (
                  <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-md">
                    Featured
                  </div>
                )}

                {project.images?.length > 1 && (
                  <div className="absolute bottom-3 right-3 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-md">
                    {project.images.length} images
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-4 p-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {project.name}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/60">
                    {project.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.platform && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
                      {project.platform}
                    </span>
                  )}

                  {project.status && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
                      {project.status}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-2">
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                      <ExternalLink size={14} />
                      Live
                    </a>
                  )}

                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                      <FaGithub size={15} />
                      GitHub
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      startEdit(project)
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={
                      deletingId === project.id
                    }
                    onClick={() =>
                      handleDelete(project.id)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/10 bg-red-500/5 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={15} />

                    {deletingId === project.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/20 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            {/* Close */}
            <button
              type="button"
              onClick={resetForm}
              className="absolute right-4 top-4 rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-6 pr-10">
              <h2 className="text-xl font-semibold text-white">
                {editingId
                  ? "Edit Project"
                  : "Create Project"}
              </h2>

              <p className="mt-1 text-sm text-white/50">
                Add the project information and
                images.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Project Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Project name"
                  className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the project..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/30 focus:border-white/30"
                />
              </div>

              {/* Links */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Live Link
                  </label>

                  <input
                    type="url"
                    name="liveLink"
                    value={form.liveLink}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    GitHub Link
                  </label>

                  <input
                    type="url"
                    name="githubLink"
                    value={form.githubLink}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
                  />
                </div>
              </div>

              {/* Status / Platform */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                  >
                    <option
                      value=""
                      className="bg-slate-900 text-white"
                    >
                      Select status
                    </option>

                    {statusOptions.map(
                      (status) => (
                        <option
                          key={status.value}
                          value={status.value}
                          className="bg-slate-900 text-white"
                        >
                          {status.label}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {/* Platform */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Platform
                  </label>

                  <select
                    name="platform"
                    value={form.platform}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                  >
                    <option
                      value=""
                      className="bg-slate-900 text-white"
                    >
                      Select platform
                    </option>

                    {platformOptions.map(
                      (platform) => (
                        <option
                          key={platform.value}
                          value={platform.value}
                          className="bg-slate-900 text-white"
                        >
                          {platform.label}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {/* Approach */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Approach Taken
                </label>

                <textarea
                  name="approachTaken"
                  value={form.approachTaken}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Explain the approach taken..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/30 focus:border-white/30"
                />
              </div>

              {/* Sort Order / Featured */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Sort Order
                  </label>

                  <input
                    type="number"
                    name="sortOrder"
                    value={form.sortOrder}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />

                  <span className="text-sm text-white/80">
                    Featured project
                  </span>
                </label>
              </div>

              {/* Existing Images */}
              {editingId &&
                existingImages.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white/80">
                          Existing Images
                        </h3>

                        <p className="mt-1 text-xs text-white/40">
                          New images will be added
                          to these images.
                        </p>
                      </div>

                      <span className="text-xs text-white/40">
                        {existingImages.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {existingImages.map(
                        (image, index) => (
                          <div
                            key={`${image}-${index}`}
                            className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5"
                          >
                            <Image
                              src={image}
                              alt={`${form.name} existing image ${
                                index + 1
                              }`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Image Upload */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white/80">
                      {editingId
                        ? "Add New Images"
                        : "Project Images"}
                    </h3>

                    <p className="mt-1 text-xs text-white/40">
                      Select up to {MAX_IMAGES}{" "}
                      images. You can select them
                      in multiple batches.
                    </p>
                  </div>

                  <span className="text-xs text-white/50">
                    {selectedImages.length}/
                    {MAX_IMAGES}
                  </span>
                </div>

                <label
                  className={`flex min-h-32 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 transition ${
                    selectedImages.length >=
                    MAX_IMAGES
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-white/10"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Upload
                      size={22}
                      className="text-white/50"
                    />

                    <span className="text-sm text-white/70">
                      {selectedImages.length >=
                      MAX_IMAGES
                        ? "Maximum images selected"
                        : "Click to select images"}
                    </span>

                    <span className="text-xs text-white/40">
                      PNG, JPG, JPEG, WEBP
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={
                      selectedImages.length >=
                      MAX_IMAGES
                    }
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Selected Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white/80">
                        Selected Images
                      </h3>

                      <span className="text-xs text-white/40">
                        {imagePreviews.length}{" "}
                        selected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {imagePreviews.map(
                        (preview, index) => (
                          <div
                            key={preview}
                            className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5"
                          >
                            <Image
                              src={preview}
                              alt={`Selected image ${
                                index + 1
                              }`}
                              fill
                              unoptimized
                              className="object-cover"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeSelectedImage(
                                  index,
                                )
                              }
                              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-red-500/80"
                              aria-label={`Remove image ${
                                index + 1
                              }`}
                            >
                              <X size={16} />
                            </button>

                            <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-md">
                              {index + 1}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Error */}
              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingId
                      ? "Update Project"
                      : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}