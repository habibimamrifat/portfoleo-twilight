"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Workflow,
} from "lucide-react";
import Card from "@/components/common/Card";



const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ProcessStep {
  id: string;
  name: string;
  detail: string;
  sortOrder: number;
  isActive: boolean;
}

interface ProcessStepForm {
  name: string;
  detail: string;
  sortOrder: string;
  isActive: boolean;
}

const emptyForm: ProcessStepForm = {
  name: "",
  detail: "",
  sortOrder: "0",
  isActive: true,
};

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

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("portfolio")
      : null;

  useEffect(() => {
    let cancelled = false;

    const fetchProcessSteps = async () => {
      try {
        const response = await fetch(
          `${API_URL}/process-steps`,
        );

        const result = await response.json();

        if (cancelled) return;

        const processData: ProcessStep[] = Array.isArray(
          result,
        )
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        setProcessSteps(processData);
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
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (step: ProcessStep) => {
    setEditingId(step.id);

    setForm({
      name: step.name ?? "",
      detail: step.detail ?? "",
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
      const body = {
        name: form.name,
        detail: form.detail,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      };

      const url = editingId
        ? `${API_URL}/process-steps/${editingId}`
        : `${API_URL}/process-steps`;

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

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
    if (!token) {
      alert("You are not authenticated.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this process step?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/process-steps/${id}`,
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
            flex items-center gap-2 rounded-2xl
            border border-white/20 bg-white/10
            px-4 py-2.5 text-sm text-white
            backdrop-blur-xs transition-all duration-300
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
                {/* Step Number */}
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-2xl border border-white/10
                    bg-white/5 text-sm text-white/60
                  "
                >
                  {String(index + 1).padStart(2, "0")}
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
                            rounded-full border px-2
                            py-0.5 text-[10px]
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
                          handleDelete(step.id)
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
            fixed inset-0 z-50 flex items-center
            justify-center bg-black/60 p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              relative w-full max-w-2xl
              overflow-hidden rounded-3xl
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
                  flex h-9 w-9 items-center
                  justify-center rounded-xl
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
                      w-full rounded-xl
                      border border-white/10
                      bg-white/5 px-4 py-3
                      text-sm text-white
                      outline-none transition
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
                      w-full resize-none rounded-xl
                      border border-white/10
                      bg-white/5 px-4 py-3
                      text-sm leading-6 text-white
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
                    required
                    type="number"
                    min="0"
                    name="sortOrder"
                    value={form.sortOrder}
                    onChange={handleChange}
                    className="
                      w-full rounded-xl
                      border border-white/10
                      bg-white/5 px-4 py-3
                      text-sm text-white
                      outline-none transition
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