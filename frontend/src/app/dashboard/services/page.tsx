"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  icon?: string | null;
  sortOrder: number;
  isActive?: boolean;
}

interface ServiceForm {
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const emptyForm: ServiceForm = {
  name: "",
  description: "",
  icon: "",
  sortOrder: 0,
  isActive: true,
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");

  /*
   * Load services
   */
  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/services`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const result = await response.json();

        /*
         * Your backend ResponseMessage interceptor may return:
         * { message, data }
         *
         * If there is no wrapper, it will simply use the response directly.
         */
        const data = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        if (!cancelled) {
          setServices(data);
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);

        if (!cancelled) {
          setError("Failed to load services.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Reset form
   */
  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsFormOpen(false);
    setError("");
  };

  /*
   * Open create form
   */
  const handleAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setIsFormOpen(true);
  };

  /*
   * Open edit form
   */
  const handleEdit = (service: Service) => {
    setForm({
      name: service.name,
      description: service.description,
      icon: service.icon ?? "",
      sortOrder: service.sortOrder,
      isActive: service.isActive ?? true,
    });

    setEditingId(service.id);
    setError("");
    setIsFormOpen(true);
  };

  /*
   * Submit create/update
   */
  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("portfolio");

      if (!token) {
        throw new Error("Authentication required");
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        icon: form.icon.trim() || undefined,
        sortOrder: Number(form.sortOrder),
        isActive: form.isActive,
      };

      if (!payload.name) {
        throw new Error("Service name is required");
      }

      if (!payload.description) {
        throw new Error("Service description is required");
      }

      const url = editingId
        ? `${API_URL}/services/${editingId}`
        : `${API_URL}/services`;

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to save service",
        );
      }

      const savedService: Service =
        result?.data ?? result;

      if (editingId) {
        setServices((prev) =>
          prev.map((service) =>
            service.id === editingId
              ? savedService
              : service,
          ),
        );
      } else {
        setServices((prev) => [...prev, savedService]);
      }

      resetForm();
    } catch (err) {
      console.error("Failed to save service:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save service.",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Delete service
   */
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const token = localStorage.getItem("portfolio");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/services/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to delete service",
        );
      }

      setServices((prev) =>
        prev.filter((service) => service.id !== id),
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error("Failed to delete service:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete service.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full w-full p-2 pb-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Services
          </h1>

          <p className="mt-1 text-sm text-white/45">
            Manage the services displayed on your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="
            flex items-center gap-2 rounded-2xl
            border border-white/20 bg-white/10
            px-4 py-2.5 text-sm text-white
            backdrop-blur-xs
            transition-all duration-300
            hover:bg-white/15
          "
        >
          <Plus size={17} />
          Add Service
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="
            mb-5 rounded-2xl border border-red-400/20
            bg-red-500/10 px-4 py-3
            text-sm text-red-300 backdrop-blur-xs
          "
        >
          {error}
        </div>
      )}

      {/* Form */}
      {isFormOpen && (
        <div
          className="
            mb-6 overflow-hidden rounded-3xl
            border border-white/20 bg-white/5
            p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)]
            backdrop-blur-xs
          "
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-white">
                {editingId
                  ? "Edit Service"
                  : "Create Service"}
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Configure your portfolio service.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="
                flex h-9 w-9 items-center justify-center
                rounded-xl border border-white/10
                text-white/50 transition
                hover:bg-white/10 hover:text-white
              "
            >
              <X size={17} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="service-name"
                className="mb-2 block text-sm text-white/70"
              >
                Name
              </label>

              <input
                id="service-name"
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    name: event.currentTarget.value,
                  }))
                }
                placeholder="Full-Stack Development"
                className="
                  w-full rounded-2xl border border-white/15
                  bg-white/5 px-4 py-3
                  text-sm text-white outline-none
                  placeholder:text-white/25
                  backdrop-blur-xs
                  transition
                  focus:border-white/30
                  focus:bg-white/10
                "
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="service-description"
                className="mb-2 block text-sm text-white/70"
              >
                Description
              </label>

              <textarea
                id="service-description"
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description:
                      event.currentTarget.value,
                  }))
                }
                placeholder="Describe what this service provides..."
                rows={4}
                className="
                  w-full resize-none rounded-2xl
                  border border-white/15 bg-white/5
                  px-4 py-3 text-sm text-white
                  outline-none placeholder:text-white/25
                  backdrop-blur-xs transition
                  focus:border-white/30
                  focus:bg-white/10
                "
              />
            </div>

            {/* Icon + Sort Order */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="service-icon"
                  className="mb-2 block text-sm text-white/70"
                >
                  Icon
                </label>

                <input
                  id="service-icon"
                  type="text"
                  value={form.icon}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      icon: event.currentTarget.value,
                    }))
                  }
                  placeholder="Code2"
                  className="
                    w-full rounded-2xl border border-white/15
                    bg-white/5 px-4 py-3
                    text-sm text-white outline-none
                    placeholder:text-white/25
                    backdrop-blur-xs transition
                    focus:border-white/30
                    focus:bg-white/10
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="service-sort-order"
                  className="mb-2 block text-sm text-white/70"
                >
                  Sort Order
                </label>

                <input
                  id="service-sort-order"
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      sortOrder: Number(
                        event.currentTarget.value,
                      ),
                    }))
                  }
                  className="
                    w-full rounded-2xl border border-white/15
                    bg-white/5 px-4 py-3
                    text-sm text-white outline-none
                    backdrop-blur-xs transition
                    focus:border-white/30
                    focus:bg-white/10
                  "
                />
              </div>
            </div>

            {/* Active */}
            <label
              htmlFor="service-active"
              className="
                flex cursor-pointer items-center gap-3
                rounded-2xl border border-white/10
                bg-white/5 px-4 py-3
                backdrop-blur-xs
              "
            >
              <input
                id="service-active"
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    isActive:
                      event.currentTarget.checked,
                  }))
                }
                className="h-4 w-4 accent-white"
              />

              <div>
                <p className="text-sm text-white">
                  Active
                </p>

                <p className="text-xs text-white/40">
                  Show this service on the public portfolio.
                </p>
              </div>
            </label>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="
                  rounded-2xl border border-white/15
                  px-5 py-2.5 text-sm text-white/60
                  transition hover:bg-white/10
                  hover:text-white disabled:opacity-40
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="
                  rounded-2xl border border-white/20
                  bg-white/10 px-5 py-2.5
                  text-sm text-white
                  backdrop-blur-xs
                  transition-all duration-300
                  hover:bg-white/15
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Service"
                    : "Create Service"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services */}
      {loading ? (
        <div
          className="
            flex min-h-60 items-center justify-center
            rounded-3xl border border-white/10
            bg-white/5 text-sm text-white/40
            backdrop-blur-xs
          "
        >
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div
          className="
            flex min-h-60 flex-col items-center
            justify-center rounded-3xl
            border border-white/10 bg-white/5
            text-center backdrop-blur-xs
          "
        >
          <BriefcaseBusiness
            size={32}
            strokeWidth={1.4}
            className="mb-3 text-white/30"
          />

          <p className="text-sm text-white/50">
            No services found.
          </p>

          <button
            type="button"
            onClick={handleAdd}
            className="
              mt-4 rounded-xl border border-white/15
              bg-white/5 px-4 py-2 text-xs
              text-white/60 transition
              hover:bg-white/10 hover:text-white
            "
          >
            Add your first service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.id}
              className="
                group relative overflow-hidden
                rounded-3xl border border-white/15
                bg-white/5 p-6
                shadow-[0_25px_80px_rgba(0,0,0,0.3)]
                backdrop-blur-xs
                transition-all duration-300
                hover:border-white/25
                hover:bg-white/[0.07]
              "
            >
              {/* Top shine */}
              <div
                className="
                  pointer-events-none absolute
                  inset-x-0 top-0 h-px
                  bg-gradient-to-r
                  from-transparent via-white/30
                  to-transparent
                "
              />

              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 gap-4">
                  {/* Icon */}
                  <div
                    className="
                      flex h-12 w-12 shrink-0
                      items-center justify-center
                      rounded-2xl border border-white/15
                      bg-white/5 text-white/70
                    "
                  >
                    <BriefcaseBusiness
                      size={20}
                      strokeWidth={1.6}
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-medium text-white">
                      {service.name}
                    </h3>

                    <p className="mt-1 line-clamp-3 text-sm leading-6 text-white/45">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(service)}
                    title="Edit"
                    className="
                      flex h-9 w-9 items-center justify-center
                      rounded-xl border border-transparent
                      text-white/40 transition
                      hover:border-white/15
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(service.id)
                    }
                    disabled={deletingId === service.id}
                    title="Delete"
                    className="
                      flex h-9 w-9 items-center justify-center
                      rounded-xl border border-transparent
                      text-white/40 transition
                      hover:border-red-400/20
                      hover:bg-red-500/10
                      hover:text-red-300
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center gap-3">
                <span
                  className={`
                    rounded-full border px-2.5 py-1
                    text-[11px]
                    ${
                      service.isActive
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 bg-white/5 text-white/35"
                    }
                  `}
                >
                  {service.isActive
                    ? "Active"
                    : "Inactive"}
                </span>

                <span className="text-xs text-white/30">
                  Order {service.sortOrder}
                </span>

                {service.icon && (
                  <span className="text-xs text-white/30">
                    {service.icon}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}