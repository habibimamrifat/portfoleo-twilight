"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Layers3,
} from "lucide-react";
import Card from "@/components/common/Card";



const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const toolCategories = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS",
  "OTHER",
];

interface Tool {
  id: string;
  name: string;
  logo?: string | null;
  description?: string | null;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

interface ToolForm {
  name: string;
  logo: string;
  description: string;
  category: string;
  sortOrder: string;
  isActive: boolean;
}

const emptyForm: ToolForm = {
  name: "",
  logo: "",
  description: "",
  category: "FRONTEND",
  sortOrder: "0",
  isActive: true,
};

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(
    null,
  );

  const [form, setForm] = useState<ToolForm>(emptyForm);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("portfolio")
      : null;

  useEffect(() => {
    let cancelled = false;

    const fetchTools = async () => {
      try {
        const response = await fetch(`${API_URL}/tools`);

        const result = await response.json();

        if (cancelled) return;

        const toolsData: Tool[] = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        setTools(toolsData);
      } catch (error) {
        console.error("Failed to fetch tools:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTools();

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

  const openEditModal = (tool: Tool) => {
    setEditingId(tool.id);

    setForm({
      name: tool.name ?? "",
      logo: tool.logo ?? "",
      description: tool.description ?? "",
      category: tool.category ?? "FRONTEND",
      sortOrder: String(tool.sortOrder ?? 0),
      isActive: tool.isActive ?? true,
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
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
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
        logo: form.logo.trim() || undefined,
        description:
          form.description.trim() || undefined,
        category: form.category,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      };

      const url = editingId
        ? `${API_URL}/tools/${editingId}`
        : `${API_URL}/tools`;

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
          result?.message || "Failed to save tool",
        );
      }

      const savedTool: Tool =
        result?.data ?? result;

      if (editingId) {
        setTools((prev) =>
          prev
            .map((tool) =>
              tool.id === editingId
                ? savedTool
                : tool,
            )
            .sort(
              (a, b) =>
                a.category.localeCompare(b.category) ||
                a.sortOrder - b.sortOrder,
            ),
        );
      } else {
        setTools((prev) =>
          [...prev, savedTool].sort(
            (a, b) =>
              a.category.localeCompare(b.category) ||
              a.sortOrder - b.sortOrder,
          ),
        );
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save tool:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save tool",
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
      "Are you sure you want to delete this tool?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/tools/${id}`,
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
          result?.message || "Failed to delete tool",
        );
      }

      setTools((prev) =>
        prev.filter((tool) => tool.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete tool:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete tool",
      );
    }
  };

  const groupedTools = tools.reduce(
    (groups, tool) => {
      if (!groups[tool.category]) {
        groups[tool.category] = [];
      }

      groups[tool.category].push(tool);

      return groups;
    },
    {} as Record<string, Tool[]>,
  );

  return (
    <div className="min-h-full space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Stack
          </h1>

          <p className="mt-1 text-sm text-white/50">
            Manage the technologies and tools you use.
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
          Add Tool
        </button>
      </div>

      {/* Tools */}
      {loading ? (
        <div className="py-20 text-center text-sm text-white/40">
          Loading stack...
        </div>
      ) : tools.length === 0 ? (
        <Card className="p-10">
          <div className="flex flex-col items-center justify-center text-center">
            <Layers3
              size={40}
              strokeWidth={1.3}
              className="text-white/30"
            />

            <h2 className="mt-4 text-lg text-white">
              No tools added
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Add the technologies that make up your
              development stack.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTools).map(
            ([category, categoryTools]) => (
              <div key={category}>
                <div className="mb-3 flex items-center gap-3">
                  <h2 className="text-sm font-medium uppercase tracking-wider text-white/50">
                    {category.replaceAll("_", " ")}
                  </h2>

                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <Card
                      key={tool.id}
                      className="p-5 backdrop-blur-xs"
                    >
                      <div className="flex items-start gap-4">
                        {/* Logo */}
                        <div
                          className="
                            flex h-12 w-12 shrink-0
                            items-center justify-center
                            overflow-hidden rounded-2xl
                            border border-white/10
                            bg-white/5
                          "
                        >
                          {tool.logo ? (
                            <img
                              src={tool.logo}
                              alt={tool.name}
                              className="h-7 w-7 object-contain"
                            />
                          ) : (
                            <Layers3
                              size={20}
                              strokeWidth={1.5}
                              className="text-white/30"
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-medium text-white">
                                {tool.name}
                              </h3>

                              <span
                                className={`
                                  mt-1 inline-block
                                  rounded-full border px-2
                                  py-0.5 text-[10px]
                                  ${
                                    tool.isActive
                                      ? "border-white/15 bg-white/10 text-white/60"
                                      : "border-white/10 bg-white/5 text-white/30"
                                  }
                                `}
                              >
                                {tool.isActive
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(tool)
                                }
                                className="
                                  flex h-8 w-8
                                  items-center justify-center
                                  rounded-lg
                                  text-white/40
                                  transition
                                  hover:bg-white/10
                                  hover:text-white
                                "
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(tool.id)
                                }
                                className="
                                  flex h-8 w-8
                                  items-center justify-center
                                  rounded-lg
                                  text-white/40
                                  transition
                                  hover:bg-white/10
                                  hover:text-white
                                "
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {tool.description && (
                            <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/40">
                              {tool.description}
                            </p>
                          )}

                          <p className="mt-3 text-[10px] text-white/25">
                            Order: {tool.sortOrder}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          )}
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
                    ? "Edit Tool"
                    : "Add Tool"}
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  Add a technology to your development stack.
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
                    Tool Name
                  </label>

                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Next.js"
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

                {/* Logo */}
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Logo URL
                  </label>

                  <input
                    name="logo"
                    value={form.logo}
                    onChange={handleChange}
                    placeholder="https://..."
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

                {/* Description */}
                <div>
                  <label className="mb-2 block text-xs text-white/50">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Briefly describe how you use this technology..."
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

                {/* Category + Sort Order */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs text-white/50">
                      Category
                    </label>

                    <select
                      required
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="
                        w-full rounded-xl
                        border border-white/10
                        bg-black/30 px-4 py-3
                        text-sm text-white
                        outline-none transition
                        focus:border-white/30
                      "
                    >
                      {toolCategories.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                            className="bg-black text-white"
                          >
                            {category.replaceAll(
                              "_",
                              " ",
                            )}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

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
                      ? "Update Tool"
                      : "Create Tool"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}