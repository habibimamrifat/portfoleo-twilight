"use client";

import { useEffect, useState } from "react";
import {
  ExternalLink,
  FolderKanban,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ProjectStatus =
  | "PLANNING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "MAINTENANCE";

type ProjectPlatform =
  | "WEB"
  | "MOBILE"
  | "DESKTOP"
  | "API"
  | "OTHER";

interface Project {
  id: string;
  name: string;
  description: string;
  images: string[];
  liveLink?: string | null;
  githubLink?: string | null;
  status: ProjectStatus;
  platform: ProjectPlatform;
  approachTaken?: string | null;
  featured: boolean;
  sortOrder: number;
  isActive?: boolean;
}

interface ProjectForm {
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
}

const initialForm: ProjectForm = {
  name: "",
  description: "",
  liveLink: "",
  githubLink: "",
  status: "PLANNING",
  platform: "WEB",
  approachTaken: "",
  featured: false,
  sortOrder: "0",
  isActive: true,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [form, setForm] = useState<ProjectForm>(initialForm);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * =========================
   * FETCH PROJECTS
   * =========================
   */

  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      try {
        setError("");

        const response = await fetch(`${API_URL}/projects`);

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const result = await response.json();

        /*
         * Backend ResponseMessage interceptor may return:
         *
         * {
         *   message: "...",
         *   data: [...]
         * }
         *
         * Or the API may return the array directly.
         */

        const projectData: Project[] = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        if (!cancelled) {
          setProjects(projectData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch projects",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * =========================
   * RESET FORM
   * =========================
   */

  function resetForm() {
    imagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    setForm(initialForm);

    setSelectedImages([]);
    setImagePreviews([]);

    setEditingId(null);
    setIsFormOpen(false);

    setError("");
  }

  /*
   * =========================
   * CREATE
   * =========================
   */

  function startCreate() {
    resetForm();

    setSuccess("");

    setIsFormOpen(true);
  }

  /*
   * =========================
   * EDIT
   * =========================
   */

  function startEdit(project: Project) {
    setEditingId(project.id);

    setForm({
      name: project.name,
      description: project.description,
      liveLink: project.liveLink ?? "",
      githubLink: project.githubLink ?? "",
      status: project.status,
      platform: project.platform,
      approachTaken: project.approachTaken ?? "",
      featured: project.featured,
      sortOrder: String(project.sortOrder),
      isActive: project.isActive ?? true,
    });

    setSelectedImages([]);
    setImagePreviews([]);

    setError("");
    setSuccess("");

    setIsFormOpen(true);
  }

  /*
   * =========================
   * FORM CHANGE
   * =========================
   */

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = event.currentTarget;

    if (type === "checkbox") {
      const checked = (
        event.currentTarget as HTMLInputElement
      ).checked;

      setForm((previous) => ({
        ...previous,
        [name]: checked,
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  /*
   * =========================
   * IMAGE SELECT
   * =========================
   */

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    imagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    const previews = files.map((file) =>
      URL.createObjectURL(file),
    );

    setSelectedImages(files);
    setImagePreviews(previews);

    /*
     * Allows selecting the same file again later.
     */
    event.target.value = "";
  }

  /*
   * =========================
   * REMOVE SELECTED IMAGE
   * =========================
   */

  function removeSelectedImage(index: number) {
    URL.revokeObjectURL(imagePreviews[index]);

    const newImages = selectedImages.filter(
      (_, imageIndex) => imageIndex !== index,
    );

    const newPreviews = imagePreviews.filter(
      (_, imageIndex) => imageIndex !== index,
    );

    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  }

  /*
   * =========================
   * SUBMIT
   * =========================
   */

  async function handleSubmit(
    event: React.SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("portfolio");

      if (!token) {
        throw new Error("Authentication required");
      }

      const formData = new FormData();

      /*
       * Basic fields
       */

      formData.append("name", form.name.trim());

      formData.append(
        "description",
        form.description.trim(),
      );

      formData.append("status", form.status);

      formData.append("platform", form.platform);

      formData.append(
        "featured",
        String(form.featured),
      );

      formData.append(
        "sortOrder",
        String(Number(form.sortOrder) || 0),
      );

      formData.append(
        "isActive",
        String(form.isActive),
      );

      /*
       * Optional fields
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
       * Raw image files
       *
       * Backend expects:
       *
       * images
       * images
       * images
       */

      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      const url = editingId
        ? `${API_URL}/projects/${editingId}`
        : `${API_URL}/projects`;

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
          Array.isArray(result?.message)
            ? result.message.join(", ")
            : result?.message ??
              "Failed to save project",
        );
      }

      /*
       * Response may be:
       *
       * {
       *   message: "...",
       *   data: project
       * }
       *
       * or directly:
       *
       * project
       */

      const savedProject: Project =
        result?.data ?? result;

      if (editingId) {
        setProjects((previous) =>
          previous.map((project) =>
            project.id === editingId
              ? savedProject
              : project,
          ),
        );

        setSuccess(
          "Project updated successfully",
        );
      } else {
        setProjects((previous) => [
          ...previous,
          savedProject,
        ]);

        setSuccess(
          "Project created successfully",
        );
      }

      /*
       * Clean image preview URLs
       */

      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });

      setForm(initialForm);
      setSelectedImages([]);
      setImagePreviews([]);
      setEditingId(null);
      setIsFormOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save project",
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * =========================
   * DELETE
   * =========================
   */

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("portfolio");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/projects/${id}`,
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
          Array.isArray(result?.message)
            ? result.message.join(", ")
            : result?.message ??
              "Failed to delete project",
        );
      }

      setProjects((previous) =>
        previous.filter(
          (project) => project.id !== id,
        ),
      );

      setSuccess(
        "Project deleted successfully",
      );

      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete project",
      );
    }
  }

  /*
   * =========================
   * UI
   * =========================
   */

  return (
    <div className="min-h-full p-2 pb-8">
      {/* ================= HEADER ================= */}

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-11 w-11 items-center
              justify-center rounded-2xl
              border border-white/15
              bg-white/5 backdrop-blur-xs
            "
          >
            <FolderKanban
              size={20}
              className="text-white/80"
            />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-white">
              Projects
            </h1>

            <p className="text-sm text-white/40">
              Manage your portfolio projects
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="
            flex items-center gap-2
            rounded-2xl border border-white/20
            bg-white/10 px-4 py-2.5
            text-sm text-white
            backdrop-blur-xs transition
            hover:bg-white/15
          "
        >
          <Plus size={17} />
          Add Project
        </button>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div
          className="
            mb-4 rounded-2xl
            border border-red-400/20
            bg-red-500/10 px-4 py-3
            text-sm text-red-200
          "
        >
          {error}
        </div>
      )}

      {/* ================= SUCCESS ================= */}

      {success && (
        <div
          className="
            mb-4 rounded-2xl
            border border-green-400/20
            bg-green-500/10
            px-4 py-3 text-sm
            text-green-200
          "
        >
          {success}
        </div>
      )}

      {/* ================= FORM ================= */}

      {isFormOpen && (
        <div
          className="
            mb-6 overflow-hidden
            rounded-3xl border border-white/20
            bg-white/5
            shadow-[0_25px_80px_rgba(0,0,0,0.45)]
            backdrop-blur-xs
          "
        >
          {/* Form header */}

          <div
            className="
              flex items-center justify-between
              border-b border-white/10
              px-6 py-5
            "
          >
            <div>
              <h2 className="text-lg font-semibold text-white">
                {editingId
                  ? "Edit Project"
                  : "Create Project"}
              </h2>

              <p className="mt-1 text-xs text-white/40">
                Upload project images directly
                from your computer.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="
                flex h-9 w-9 items-center
                justify-center rounded-xl
                border border-white/10
                text-white/50 transition
                hover:bg-white/10
                hover:text-white
              "
            >
              <X size={17} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6"
          >
            {/* ================= BASIC ================= */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-white/50">
                  Project Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Pet Hub"
                  className="
                    h-11 w-full rounded-xl
                    border border-white/10
                    bg-white/5 px-4
                    text-sm text-white
                    outline-none
                    placeholder:text-white/20
                    focus:border-white/25
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/50">
                  Sort Order
                </label>

                <input
                  name="sortOrder"
                  type="number"
                  min="0"
                  value={form.sortOrder}
                  onChange={handleChange}
                  className="
                    h-11 w-full rounded-xl
                    border border-white/10
                    bg-white/5 px-4
                    text-sm text-white
                    outline-none
                    focus:border-white/25
                  "
                />
              </div>
            </div>

            {/* ================= DESCRIPTION ================= */}

            <div>
              <label className="mb-2 block text-xs text-white/50">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe the project..."
                className="
                  w-full resize-none rounded-xl
                  border border-white/10
                  bg-white/5 px-4 py-3
                  text-sm text-white
                  outline-none
                  placeholder:text-white/20
                  focus:border-white/25
                "
              />
            </div>

            {/* ================= IMAGES ================= */}

            <div>
              <label className="mb-2 block text-xs text-white/50">
                Project Images
              </label>

              <label
                className="
                  flex min-h-32 cursor-pointer
                  flex-col items-center
                  justify-center rounded-2xl
                  border border-dashed
                  border-white/20
                  bg-white/[0.03]
                  px-5 py-6 transition
                  hover:bg-white/[0.06]
                "
              >
                <FolderKanban
                  size={28}
                  className="mb-3 text-white/30"
                />

                <span className="text-sm text-white/70">
                  Click to select images
                </span>

                <span className="mt-1 text-xs text-white/30">
                  PNG, JPG, JPEG, WEBP • Up to
                  10 images
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Image previews */}

              {imagePreviews.length > 0 && (
                <div
                  className="
                    mt-4 grid grid-cols-2
                    gap-3 sm:grid-cols-3
                    md:grid-cols-5
                  "
                >
                  {imagePreviews.map(
                    (preview, index) => (
                      <div
                        key={preview}
                        className="
                          group relative
                          aspect-video
                          overflow-hidden
                          rounded-xl
                          border border-white/10
                          bg-black/20
                        "
                      >
                        <img
                          src={preview}
                          alt={`Preview ${
                            index + 1
                          }`}
                          className="
                            h-full w-full
                            object-cover
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeSelectedImage(
                              index,
                            )
                          }
                          className="
                            absolute right-2
                            top-2 flex h-7 w-7
                            items-center
                            justify-center
                            rounded-lg
                            bg-black/60
                            text-white
                            opacity-0
                            backdrop-blur-md
                            transition
                            group-hover:opacity-100
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
                <p className="mt-2 text-xs text-white/30">
                  New images will be added to
                  the existing project images.
                </p>
              )}
            </div>

            {/* ================= LINKS ================= */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-white/50">
                  Live Link
                </label>

                <input
                  name="liveLink"
                  type="url"
                  value={form.liveLink}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="
                    h-11 w-full rounded-xl
                    border border-white/10
                    bg-white/5 px-4
                    text-sm text-white
                    outline-none
                    placeholder:text-white/20
                    focus:border-white/25
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/50">
                  GitHub Link
                </label>

                <input
                  name="githubLink"
                  type="url"
                  value={form.githubLink}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="
                    h-11 w-full rounded-xl
                    border border-white/10
                    bg-white/5 px-4
                    text-sm text-white
                    outline-none
                    placeholder:text-white/20
                    focus:border-white/25
                  "
                />
              </div>
            </div>

            {/* ================= PLATFORM / STATUS ================= */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-white/50">
                  Platform
                </label>

                <select
                  name="platform"
                  value={form.platform}
                  onChange={handleChange}
                  className="
                    h-11 w-full rounded-xl
                    border border-white/10
                    bg-white/5 px-4
                    text-sm text-white
                    outline-none
                    focus:border-white/25
                  "
                >
                  <option
                    value="WEB"
                    className="bg-slate-900"
                  >
                    Web
                  </option>

                  <option
                    value="MOBILE"
                    className="bg-slate-900"
                  >
                    Mobile
                  </option>

                  <option
                    value="DESKTOP"
                    className="bg-slate-900"
                  >
                    Desktop
                  </option>

                  <option
                    value="API"
                    className="bg-slate-900"
                  >
                    API
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
                <label className="mb-2 block text-xs text-white/50">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="
                    h-11 w-full rounded-xl
                    border border-white/10
                    bg-white/5 px-4
                    text-sm text-white
                    outline-none
                    focus:border-white/25
                  "
                >
                  <option
                    value="PLANNING"
                    className="bg-slate-900"
                  >
                    Planning
                  </option>

                  <option
                    value="IN_PROGRESS"
                    className="bg-slate-900"
                  >
                    In Progress
                  </option>

                  <option
                    value="COMPLETED"
                    className="bg-slate-900"
                  >
                    Completed
                  </option>

                  <option
                    value="MAINTENANCE"
                    className="bg-slate-900"
                  >
                    Maintenance
                  </option>
                </select>
              </div>
            </div>

            {/* ================= APPROACH ================= */}

            <div>
              <label className="mb-2 block text-xs text-white/50">
                Approach Taken
              </label>

              <textarea
                name="approachTaken"
                value={form.approachTaken}
                onChange={handleChange}
                rows={4}
                placeholder="Explain the architecture, decisions, technologies, etc."
                className="
                  w-full resize-none
                  rounded-xl border
                  border-white/10
                  bg-white/5 px-4 py-3
                  text-sm text-white
                  outline-none
                  placeholder:text-white/20
                  focus:border-white/25
                "
              />
            </div>

            {/* ================= OPTIONS ================= */}

            <div className="flex flex-wrap gap-6">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-white/60">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="h-4 w-4 accent-white"
                />

                <span>Featured Project</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 text-sm text-white/60">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 accent-white"
                />

                <span>Active</span>
              </label>
            </div>

            {/* ================= ACTIONS ================= */}

            <div
              className="
                flex justify-end gap-3
                border-t border-white/10
                pt-5
              "
            >
              <button
                type="button"
                onClick={resetForm}
                className="
                  rounded-xl border
                  border-white/10
                  px-5 py-2.5
                  text-sm text-white/60
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="
                  rounded-xl border
                  border-white/20
                  bg-white/10
                  px-5 py-2.5
                  text-sm text-white
                  backdrop-blur-xs
                  transition
                  hover:bg-white/15
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {saving
                  ? "Uploading..."
                  : editingId
                    ? "Update Project"
                    : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= PROJECT LIST ================= */}

      {loading ? (
        <div
          className="
            flex min-h-60
            items-center justify-center
            text-sm text-white/40
          "
        >
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div
          className="
            flex min-h-60
            flex-col items-center
            justify-center rounded-3xl
            border border-white/10
            bg-white/5
            backdrop-blur-xs
          "
        >
          <FolderKanban
            size={32}
            className="mb-3 text-white/20"
          />

          <p className="text-sm text-white/40">
            No projects yet
          </p>

          <button
            type="button"
            onClick={startCreate}
            className="
              mt-4 text-sm text-white/70
              underline underline-offset-4
              hover:text-white
            "
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="
                overflow-hidden rounded-3xl
                border border-white/20
                bg-white/5
                shadow-[0_25px_80px_rgba(0,0,0,0.45)]
                backdrop-blur-xs
              "
            >
              {/* ================= PROJECT IMAGE ================= */}

              {project.images?.length > 0 ? (
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={project.images[0]}
                    alt={project.name}
                    className="
                      h-full w-full
                      object-cover
                    "
                  />

                  <div
                    className="
                      absolute inset-0
                      bg-gradient-to-t
                      from-black/70
                      via-transparent
                      to-transparent
                    "
                  />

                  {project.images.length > 1 && (
                    <span
                      className="
                        absolute bottom-3
                        left-3 rounded-lg
                        border border-white/10
                        bg-black/50 px-2 py-1
                        text-xs text-white/70
                        backdrop-blur-md
                      "
                    >
                      +{project.images.length - 1}{" "}
                      images
                    </span>
                  )}

                  {project.featured && (
                    <span
                      className="
                        absolute right-3
                        top-3 flex items-center
                        gap-1 rounded-lg
                        border border-white/10
                        bg-black/50
                        px-2 py-1
                        text-xs text-white/80
                        backdrop-blur-md
                      "
                    >
                      <Star
                        size={12}
                        fill="currentColor"
                      />
                      Featured
                    </span>
                  )}
                </div>
              ) : (
                <div
                  className="
                    flex h-52
                    items-center
                    justify-center
                    bg-white/[0.03]
                  "
                >
                  <FolderKanban
                    size={36}
                    className="text-white/15"
                  />
                </div>
              )}

              {/* ================= CONTENT ================= */}

              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-white">
                      {project.name}
                    </h3>

                    <p className="mt-1 text-xs text-white/40">
                      {project.platform} •{" "}
                      {project.status}
                    </p>
                  </div>

                  <span
                    className={`
                      rounded-lg border
                      px-2 py-1 text-[10px]
                      ${
                        project.isActive
                          ? "border-green-400/20 bg-green-500/10 text-green-300"
                          : "border-white/10 bg-white/5 text-white/30"
                      }
                    `}
                  >
                    {project.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <p
                  className="
                    line-clamp-3
                    text-sm leading-6
                    text-white/50
                  "
                >
                  {project.description}
                </p>

                {/* ================= ACTIONS ================= */}

                <div
                  className="
                    mt-5 flex items-center
                    justify-between
                    border-t border-white/10
                    pt-4
                  "
                >
                  {/* Links */}

                  <div className="flex items-center gap-2">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Live project"
                        className="
                          flex h-8 w-8
                          items-center
                          justify-center
                          rounded-xl
                          border border-white/10
                          text-white/40
                          transition
                          hover:bg-white/10
                          hover:text-white
                        "
                      >
                        <ExternalLink
                          size={14}
                        />
                      </a>
                    )}

                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="GitHub"
                        className="
                          flex h-8 w-8
                          items-center
                          justify-center
                          rounded-xl
                          border border-white/10
                          text-white/40
                          transition
                          hover:bg-white/10
                          hover:text-white
                        "
                      >
                        <FaGithub size={15} />
                      </a>
                    )}
                  </div>

                  {/* Edit / Delete */}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        startEdit(project)
                      }
                      title="Edit project"
                      className="
                        flex h-8 w-8
                        items-center
                        justify-center
                        rounded-xl
                        border border-white/10
                        text-white/40
                        transition
                        hover:bg-white/10
                        hover:text-white
                      "
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(project.id)
                      }
                      title="Delete project"
                      className="
                        flex h-8 w-8
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-red-400/10
                        text-red-300/50
                        transition
                        hover:bg-red-500/10
                        hover:text-red-300
                      "
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}