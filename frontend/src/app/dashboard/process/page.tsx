"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Workflow,
  ImagePlus,
} from "lucide-react";

import Card from "@/components/common/util/Card";
import { callApi } from "@/api/callApi";
import { getApi } from "@/api/getapi";

interface ProcessStep {
  id: string;
  name: string;
  detail: string;
  img?: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface ProcessStepForm {
  name: string;
  detail: string;
  img: File | null;
  sortOrder: string;
  isActive: boolean;
}

const emptyForm: ProcessStepForm = {
  name: "",
  detail: "",
  img: null,
  sortOrder: "0",
  isActive: true,
};

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

export default function ProcessPage() {
  const [processSteps, setProcessSteps] = useState<
    ProcessStep[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(
    null,
  );

  const [form, setForm] =
    useState<ProcessStepForm>(emptyForm);

  const [existingImage, setExistingImage] =
    useState<string | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProcessSteps = async () => {
      try {
        const response = await getApi(
          "/process-steps",
        );

        if (!response.ok) {
          const result = await response.json().catch(
            () => null,
          );

          throw new Error(
            result?.message ||
              "Failed to fetch process steps",
          );
        }

        const result = await response.json();

        if (cancelled) return;

        const processData: ProcessStep[] = Array.isArray(
          result,
        )
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        setProcessSteps(
          [...processData].sort(
            (a, b) => a.sortOrder - b.sortOrder,
          ),
        );
      } catch (error) {
        console.error(
          "Failed to fetch process steps:",
          error,
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProcessSteps();

    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setExistingImage(null);
    setImagePreview(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (step: ProcessStep) => {
    setEditingId(step.id);

    const imageUrl = getImageUrl(step.img);

    setExistingImage(imageUrl);
    setImagePreview(null);

    setForm({
      name: step.name ?? "",
      detail: step.detail ?? "",
      img: null,
      sortOrder: String(step.sortOrder ?? 0),
      isActive: step.isActive ?? true,
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleActiveChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setForm((prev) => ({
      ...prev,
      img: file,
    }));

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({
      ...prev,
      img: null,
    }));

    setImagePreview(null);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Step name is required.");
      return;
    }

    if (!form.detail.trim()) {
      alert("Step detail is required.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append(
        "name",
        form.name.trim(),
      );

      formData.append(
        "detail",
        form.detail.trim(),
      );

      if (form.sortOrder !== "") {
        formData.append(
          "sortOrder",
          form.sortOrder,
        );
      }

      formData.append(
        "isActive",
        String(form.isActive),
      );

      if (form.img) {
        formData.append(
          "img",
          form.img,
        );
      }

      const response = editingId
        ? await callApi(
            `/process-steps/${editingId}`,
            "PATCH",
            formData,
            true,
          )
        : await callApi(
            "/process-steps",
            "POST",
            formData,
            true,
          );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to save process step",
        );
      }

      const savedStep: ProcessStep =
        result?.data ?? result;

      if (editingId) {
        setProcessSteps((prev) =>
          prev
            .map((step) =>
              step.id === editingId
                ? savedStep
                : step,
            )
            .sort(
              (a, b) =>
                a.sortOrder - b.sortOrder,
            ),
        );
      } else {
        setProcessSteps((prev) =>
          [...prev, savedStep].sort(
            (a, b) =>
              a.sortOrder - b.sortOrder,
          ),
        );
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error(
        "Failed to save process step:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save process step",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this process step?",
    );

    if (!confirmed) return;

    try {
      const response = await callApi(
        `/process-steps/${id}`,
        "DELETE",
        undefined,
        true,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to delete process step",
        );
      }

      setProcessSteps((prev) =>
        prev.filter((step) => step.id !== id),
      );
    } catch (error) {
      console.error(
        "Failed to delete process step:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete process step",
      );
    }
  };

  return (
    <div className="min-h-full space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Process
          </h1>

          <p className="mt-1 text-sm text-white/50">
            Manage the steps of your development process.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
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
          Add Step
        </button>
      </div>

      {/* Process Steps */}
      {loading ? (
        <div className="py-20 text-center text-sm text-white/40">
          Loading process steps...
        </div>
      ) : processSteps.length === 0 ? (
        <Card className="p-10">
          <div className="flex flex-col items-center justify-center text-center">
            <Workflow
              size={40}
              strokeWidth={1.3}
              className="text-white/30"
            />

            <h2 className="mt-4 text-lg text-white">
              No process steps added
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Add the steps you follow when working
              with clients.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="
                mt-5
                rounded-xl
                border border-white/10
                bg-white/5
                px-4 py-2
                text-sm text-white/70
                transition-all
                hover:bg-white/10
                hover:text-white
              "
            >
              Add First Step
            </button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {processSteps.map((step, index) => (
            <Card
              key={step.id}
              className="p-5 backdrop-blur-xs"
            >
              <div className="flex items-start gap-4">
                {/* Step Image */}
                <div
                  className="
                    relative
                    flex h-16 w-16 shrink-0
                    items-center justify-center
                    overflow-hidden
                    rounded-2xl
                    border border-white/10
                    bg-white/5
                  "
                >
                  {step.img ? (
                    <Image
                      src={getImageUrl(step.img) || ""}
                      alt={step.name}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <span className="text-sm text-white/40">
                      {String(index + 1).padStart(
                        2,
                        "0",
                      )}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-medium text-white">
                          {step.name}
                        </h2>

                        <span
                          className={`
                            rounded-full
                            border
                            px-2 py-0.5
                            text-[10px]
                            ${
                              step.isActive
                                ? "border-white/15 bg-white/10 text-white/70"
                                : "border-white/10 bg-white/5 text-white/30"
                            }
                          `}
                        >
                          {step.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-white/30">
                        Order: {step.sortOrder}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(step)
                        }
                        className="
                          flex h-9 w-9
                          items-center justify-center
                          rounded-xl
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
                          handleDelete(step.id)
                        }
                        className="
                          flex h-9 w-9
                          items-center justify-center
                          rounded-xl
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

                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-white/55">
                    {step.detail}
                  </p>
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
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/60
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              relative
              w-full max-w-2xl
              overflow-hidden
              rounded-3xl
              border border-white/20
              bg-white/5
              shadow-[0_25px_80px_rgba(0,0,0,0.55)]
              backdrop-blur-2xl
            "
          >
            {/* Modal Header */}
            <div
              className="
                flex items-center justify-between
                border-b border-white/10
                px-6 py-4
              "
            >
              <div>
                <h2 className="text-lg font-medium text-white">
                  {editingId
                    ? "Edit Process Step"
                    : "Add Process Step"}
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  Define a step in your development process.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-xl
                  border border-white/10
                  text-white/50
                  transition-all
                  hover:bg-white/10
                  hover:text-white
                  disabled:opacity-30
                "
              >
                <X size={17} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 p-6">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Step Name
                  </label>

                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Requirement Analysis"
                    className="
                      w-full
                      rounded-xl
                      border border-white/10
                      bg-white/5
                      px-4 py-3
                      text-sm text-white
                      outline-none
                      transition
                      placeholder:text-white/25
                      focus:border-white/30
                    "
                  />
                </div>

                {/* Detail */}
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Detail
                  </label>

                  <textarea
                    required
                    name="detail"
                    value={form.detail}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe what happens during this step..."
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border border-white/10
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

                {/* Image */}
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Process Image
                  </label>

                  <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/5">
                    {imagePreview || existingImage ? (
                      <div className="relative h-48 w-full">
                        <Image
                          src={
                            imagePreview ||
                            existingImage ||
                            ""
                          }
                          alt="Process preview"
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 672px"
                        />

                        <div className="absolute right-3 top-3 flex gap-2">
                          <label
                            htmlFor="process-image"
                            className="
                              flex h-9
                              cursor-pointer
                              items-center gap-2
                              rounded-xl
                              border border-white/10
                              bg-black/50
                              px-3
                              text-xs text-white/80
                              backdrop-blur-md
                              transition
                              hover:bg-black/70
                            "
                          >
                            <ImagePlus size={14} />
                            Change
                          </label>

                          <button
                            type="button"
                            onClick={
                              handleRemoveImage
                            }
                            className="
                              flex h-9 w-9
                              items-center justify-center
                              rounded-xl
                              border border-white/10
                              bg-black/50
                              text-white/70
                              backdrop-blur-md
                              transition
                              hover:bg-black/70
                              hover:text-white
                            "
                            title="Remove image"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="process-image"
                        className="
                          flex h-48
                          cursor-pointer
                          flex-col
                          items-center
                          justify-center
                          text-center
                          transition
                          hover:bg-white/10
                        "
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                          <ImagePlus
                            size={20}
                            className="text-white/40"
                          />
                        </div>

                        <p className="mt-3 text-sm text-white/60">
                          Upload process image
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          PNG, JPG, WEBP — max 5MB
                        </p>
                      </label>
                    )}

                    <input
                      id="process-image"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Sort Order
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    name="sortOrder"
                    value={form.sortOrder}
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-xl
                      border border-white/10
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

                {/* Active */}
                <label className="flex cursor-pointer items-center gap-3 text-sm text-white/60">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleActiveChange}
                    className="h-4 w-4 accent-white"
                  />

                  Active
                </label>
              </div>

              {/* Footer */}
              <div
                className="
                  flex justify-end gap-3
                  border-t border-white/10
                  px-6 py-4
                "
              >
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    rounded-xl
                    border border-white/10
                    px-5 py-2.5
                    text-sm text-white/60
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
                    border border-white/20
                    bg-white/10
                    px-5 py-2.5
                    text-sm text-white
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
                      ? "Update Step"
                      : "Create Step"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}