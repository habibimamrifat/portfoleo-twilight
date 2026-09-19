"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type SyntheticEvent,
} from "react";

import {
  BarChart3,
  Bell,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Cpu,
  CreditCard,
  Database,
  FileCode2,
  Globe,
  Layers,
  MessageCircle,
  Palette,
  Rocket,
  Search,
  Server,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Terminal,
  Workflow,
  Wrench,
  X,
  Zap,
} from "lucide-react";

import {
  FaCloud,
  FaDatabase,
  FaGithub,
  FaLaravel,
  FaPhp,
  FaPython,
  FaWordpress,
} from "react-icons/fa";

import {
  SiDocker,
  SiFigma,
  SiGit,
  SiJavascript,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiRedis,
  SiTypescript,
} from "react-icons/si";

import { getApi } from "@/api/getapi";
import { callApi } from "@/api/callApi";

type Service = {
  id: string;
  name: string;
  description: string;
  icon?: string | null;
  sortOrder: number;
  isActive: boolean;
};

type ServiceForm = {
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
};

type IconCategory = "all" | "lucide" | "react-icons";

type IconOption = {
  value: string;
  label: string;
  category: Exclude<IconCategory, "all">;
  component: ElementType;
};

const DEFAULT_FORM: ServiceForm = {
  name: "",
  description: "",
  icon: "lucide:Code2",
  sortOrder: 0,
  isActive: true,
};

const ICON_OPTIONS: IconOption[] = [
  {
    value: "lucide:Code2",
    label: "Code",
    category: "lucide",
    component: Code2,
  },
  {
    value: "lucide:Server",
    label: "Server",
    category: "lucide",
    component: Server,
  },
  {
    value: "lucide:Database",
    label: "Database",
    category: "lucide",
    component: Database,
  },
  {
    value: "lucide:Globe",
    label: "Web",
    category: "lucide",
    component: Globe,
  },
  {
    value: "lucide:Smartphone",
    label: "Mobile",
    category: "lucide",
    component: Smartphone,
  },
  {
    value: "lucide:Palette",
    label: "Design",
    category: "lucide",
    component: Palette,
  },
  {
    value: "lucide:Layers",
    label: "Layers",
    category: "lucide",
    component: Layers,
  },
  {
    value: "lucide:Settings",
    label: "Settings",
    category: "lucide",
    component: Settings,
  },
  {
    value: "lucide:ShieldCheck",
    label: "Security",
    category: "lucide",
    component: ShieldCheck,
  },
  {
    value: "lucide:Zap",
    label: "Performance",
    category: "lucide",
    component: Zap,
  },
  {
    value: "lucide:Bot",
    label: "AI / Bot",
    category: "lucide",
    component: Bot,
  },
  {
    value: "lucide:Cpu",
    label: "CPU",
    category: "lucide",
    component: Cpu,
  },
  {
    value: "lucide:Search",
    label: "Search",
    category: "lucide",
    component: Search,
  },
  {
    value: "lucide:ShoppingCart",
    label: "E-Commerce",
    category: "lucide",
    component: ShoppingCart,
  },
  {
    value: "lucide:CreditCard",
    label: "Payment",
    category: "lucide",
    component: CreditCard,
  },
  {
    value: "lucide:BarChart3",
    label: "Analytics",
    category: "lucide",
    component: BarChart3,
  },
  {
    value: "lucide:Rocket",
    label: "Launch",
    category: "lucide",
    component: Rocket,
  },
  {
    value: "lucide:Wrench",
    label: "Tools",
    category: "lucide",
    component: Wrench,
  },
  {
    value: "lucide:Workflow",
    label: "Workflow",
    category: "lucide",
    component: Workflow,
  },
  {
    value: "lucide:MessageCircle",
    label: "Communication",
    category: "lucide",
    component: MessageCircle,
  },
  {
    value: "lucide:FileCode2",
    label: "Development",
    category: "lucide",
    component: FileCode2,
  },
  {
    value: "lucide:Terminal",
    label: "Terminal",
    category: "lucide",
    component: Terminal,
  },
  {
    value: "lucide:BriefcaseBusiness",
    label: "Business",
    category: "lucide",
    component: BriefcaseBusiness,
  },
  {
    value: "lucide:Bell",
    label: "Notification",
    category: "lucide",
    component: Bell,
  },
  {
    value: "si:React",
    label: "React",
    category: "react-icons",
    component: SiReact,
  },
  {
    value: "si:Nextdotjs",
    label: "Next.js",
    category: "react-icons",
    component: SiNextdotjs,
  },
  {
    value: "si:Nodedotjs",
    label: "Node.js",
    category: "react-icons",
    component: SiNodedotjs,
  },
  {
    value: "si:Nestjs",
    label: "NestJS",
    category: "react-icons",
    component: SiNestjs,
  },
  {
    value: "si:Typescript",
    label: "TypeScript",
    category: "react-icons",
    component: SiTypescript,
  },
  {
    value: "si:Javascript",
    label: "JavaScript",
    category: "react-icons",
    component: SiJavascript,
  },
  {
    value: "si:Postgresql",
    label: "PostgreSQL",
    category: "react-icons",
    component: SiPostgresql,
  },
  {
    value: "si:Mongodb",
    label: "MongoDB",
    category: "react-icons",
    component: SiMongodb,
  },
  {
    value: "si:Prisma",
    label: "Prisma",
    category: "react-icons",
    component: SiPrisma,
  },
  {
    value: "si:Docker",
    label: "Docker",
    category: "react-icons",
    component: SiDocker,
  },
  {
    value: "si:Redis",
    label: "Redis",
    category: "react-icons",
    component: SiRedis,
  },
  {
    value: "si:Git",
    label: "Git",
    category: "react-icons",
    component: SiGit,
  },
  {
    value: "si:Figma",
    label: "Figma",
    category: "react-icons",
    component: SiFigma,
  },
  {
    value: "fa:Python",
    label: "Python",
    category: "react-icons",
    component: FaPython,
  },
  {
    value: "fa:Php",
    label: "PHP",
    category: "react-icons",
    component: FaPhp,
  },
  {
    value: "fa:Laravel",
    label: "Laravel",
    category: "react-icons",
    component: FaLaravel,
  },
  {
    value: "fa:Wordpress",
    label: "WordPress",
    category: "react-icons",
    component: FaWordpress,
  },
  {
    value: "fa:Cloud",
    label: "Cloud",
    category: "react-icons",
    component: FaCloud,
  },
  {
    value: "fa:Database",
    label: "Database",
    category: "react-icons",
    component: FaDatabase,
  },
  {
    value: "fa:Github",
    label: "GitHub",
    category: "react-icons",
    component: FaGithub,
  },
];

function getIconOption(value?: string | null): IconOption {
  if (!value) {
    return ICON_OPTIONS[0];
  }

  const exact = ICON_OPTIONS.find(
    (option) => option.value === value,
  );

  if (exact) {
    return exact;
  }

  const normalizedValue = value
    .replace(/^lucide:/i, "")
    .replace(/^si:/i, "")
    .replace(/^fa:/i, "")
    .replace(/^Fa/i, "")
    .trim()
    .toLowerCase();

  const byName = ICON_OPTIONS.find((option) => {
    const optionName = option.value
      .replace(/^lucide:/i, "")
      .replace(/^si:/i, "")
      .replace(/^fa:/i, "")
      .toLowerCase();

    return optionName === normalizedValue;
  });

  if (byName) {
    return byName;
  }

  const byLabel = ICON_OPTIONS.find(
    (option) =>
      option.label.toLowerCase() === normalizedValue,
  );

  return byLabel ?? ICON_OPTIONS[0];
}

function ServiceIcon({
  value,
  size = 22,
}: {
  value?: string | null;
  size?: number;
}) {
  const option = getIconOption(value);
  const Icon = option.component;

  return <Icon size={size} strokeWidth={2} />;
}

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] =
    useState<IconCategory>("all");

  const selectedIcon = getIconOption(value);
  const SelectedIcon = selectedIcon.component;

  const filteredIcons = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return ICON_OPTIONS.filter((icon) => {
      const matchesCategory =
        category === "all" ||
        icon.category === category;

      if (!matchesCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        icon.label.toLowerCase().includes(query) ||
        icon.value.toLowerCase().includes(query)
      );
    });
  }, [category, searchTerm]);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/40">
          Icon Preview
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-lg">
            <SelectedIcon size={30} strokeWidth={2} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {selectedIcon.label}
            </p>

            <p className="mt-1 truncate text-xs text-white/40">
              {selectedIcon.value}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="service-icon"
          className="mb-2 block text-sm font-medium text-white/70"
        >
          Icon
        </label>

        <input
          id="service-icon"
          type="text"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="e.g. lucide:Code2"
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/25 focus:bg-white/5"
        />

        <p className="mt-2 text-xs text-white/35">
          Enter an icon manually or select one from the
          browser.
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          setIsOpen((previous) => !previous)
        }
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
      >
        <span>
          {isOpen ? "Hide Icon Browser" : "Browse Icons"}
        </span>

        {isOpen ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </button>

      {isOpen && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <div className="border-b border-white/10 p-3">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search icons..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/20"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-white/10 p-3">
            {[
              {
                value: "all",
                label: "All",
              },
              {
                value: "lucide",
                label: "Lucide",
              },
              {
                value: "react-icons",
                label: "React Icons",
              },
            ].map((item) => {
              const isSelected =
                category === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setCategory(
                      item.value as IconCategory,
                    )
                  }
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition ${
                    isSelected
                      ? "bg-white text-black"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="max-h-80 overflow-y-auto p-3">
            {filteredIcons.length === 0 ? (
              <div className="py-10 text-center text-sm text-white/35">
                No icons found.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {filteredIcons.map((icon) => {
                  const Icon = icon.component;

                  const isSelected =
                    selectedIcon.value === icon.value;

                  return (
                    <button
                      key={icon.value}
                      type="button"
                      title={icon.label}
                      onClick={() => {
                        onChange(icon.value);
                        setIsOpen(false);
                      }}
                      className={`group relative flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border p-3 transition ${
                        isSelected
                          ? "border-white/30 bg-white/15 text-white"
                          : "border-white/5 bg-white/[0.03] text-white/50 hover:border-white/15 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon size={22} />

                      <span className="max-w-full truncate text-[10px]">
                        {icon.label}
                      </span>

                      {isSelected && (
                        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-black">
                          <Check size={10} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] =
    useState<ServiceForm>(DEFAULT_FORM);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFormOpen, setIsFormOpen] =
    useState(false);

  // =====================================================
  // API ERROR HANDLER
  // =====================================================
  const getErrorMessage = async (
    response: Response,
    fallback: string,
  ) => {
    try {
      const result = await response.json();

      if (Array.isArray(result?.message)) {
        return result.message.join(", ");
      }

      if (result?.message) {
        return result.message;
      }

      if (response.status === 401) {
        return "Unauthorized. Your authentication token may be expired or invalid.";
      }

      if (response.status === 403) {
        return "Forbidden. Your account does not have permission to manage services.";
      }

      return fallback;
    } catch {
      if (response.status === 401) {
        return "Unauthorized. Your authentication token may be expired or invalid.";
      }

      if (response.status === 403) {
        return "Forbidden. Your account does not have permission to manage services.";
      }

      return fallback;
    }
  };

  // =====================================================
  // LOAD SERVICES
  // =====================================================
  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      try {
        setError("");

        const response = await getApi(
          "/services",
          true,
        );

        if (!response.ok) {
          const message = await getErrorMessage(
            response,
            "Failed to load services.",
          );

          console.error(
            "Services request failed:",
            {
              status: response.status,
              statusText: response.statusText,
              message,
            },
          );

          throw new Error(message);
        }

        const result = await response.json();

        const data = Array.isArray(result)
          ? result
          : result?.data ?? [];

        if (!cancelled) {
          setServices(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load services.",
          );
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

  // =====================================================
  // REFRESH SERVICES
  // =====================================================
  const fetchServices = async () => {
    try {
      setError("");

      const response = await getApi(
        "/services",
        true,
      );

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          "Failed to load services.",
        );

        console.error(
          "Services refresh failed:",
          {
            status: response.status,
            statusText: response.statusText,
            message,
          },
        );

        throw new Error(message);
      }

      const result = await response.json();

      const data = Array.isArray(result)
        ? result
        : result?.data ?? [];

      setServices(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load services.",
      );
    }
  };

  // =====================================================
  // RESET FORM
  // =====================================================
  const resetForm = () => {
    setForm({
      ...DEFAULT_FORM,
      sortOrder: services.length,
    });

    setEditingId(null);
    setIsFormOpen(false);
  };

  // =====================================================
  // CREATE
  // =====================================================
  const startCreate = () => {
    setError("");
    setSuccess("");

    setForm({
      ...DEFAULT_FORM,
      sortOrder: services.length,
    });

    setEditingId(null);
    setIsFormOpen(true);
  };

  // =====================================================
  // EDIT
  // =====================================================
  const startEdit = (service: Service) => {
    setError("");
    setSuccess("");

    const resolvedIcon = getIconOption(
      service.icon,
    );

    setForm({
      name: service.name ?? "",
      description: service.description ?? "",
      icon: resolvedIcon.value,
      sortOrder: service.sortOrder ?? 0,
      isActive: service.isActive ?? true,
    });

    setEditingId(service.id);
    setIsFormOpen(true);
  };

  // =====================================================
  // SUBMIT
  // =====================================================
  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Service name is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Service description is required.");
      return;
    }

    if (!form.icon.trim()) {
      setError("Please select an icon.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        icon: form.icon.trim(),
        sortOrder: Number(form.sortOrder),
        isActive: form.isActive,
      };

      const response = editingId
        ? await callApi(
            `/services/${editingId}`,
            "PATCH",
            payload,
            true,
          )
        : await callApi(
            "/services",
            "POST",
            payload,
            true,
          );

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          "Failed to save service.",
        );

        console.error(
          "Service save failed:",
          {
            status: response.status,
            statusText: response.statusText,
            message,
          },
        );

        throw new Error(message);
      }

      await fetchServices();

      setSuccess(
        editingId
          ? "Service updated successfully."
          : "Service created successfully.",
      );

      setForm(DEFAULT_FORM);
      setEditingId(null);
      setIsFormOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save service.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================
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
      setSuccess("");

      const response = await callApi(
        `/services/${id}`,
        "DELETE",
        undefined,
        true,
      );

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          "Failed to delete service.",
        );

        console.error(
          "Service delete failed:",
          {
            status: response.status,
            statusText: response.statusText,
            message,
          },
        );

        throw new Error(message);
      }

      await fetchServices();

      if (editingId === id) {
        resetForm();
      }

      setSuccess("Service deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete service.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // TOGGLE ACTIVE
  // =====================================================
  const toggleActive = async (
    service: Service,
  ) => {
    try {
      setError("");
      setSuccess("");

      const response = await callApi(
        `/services/${service.id}`,
        "PATCH",
        {
          isActive: !service.isActive,
        },
        true,
      );

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          "Failed to update service status.",
        );

        console.error(
          "Service status update failed:",
          {
            status: response.status,
            statusText: response.statusText,
            message,
          },
        );

        throw new Error(message);
      }

      await fetchServices();

      setSuccess(
        service.isActive
          ? "Service deactivated."
          : "Service activated.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update service status.",
      );
    }
  };

  return (
    <div className="min-h-full w-full px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Dashboard
            </p>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Services
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-white/45">
              Manage the services displayed on your
              portfolio.
            </p>
          </div>

          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            + Add Service
          </button>
        </div>

        {(error || success) && (
          <div className="mb-6 space-y-3">
            {error && (
              <div className="flex items-start justify-between gap-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                <span>{error}</span>

                <button
                  type="button"
                  onClick={() => setError("")}
                  className="shrink-0 text-red-200/60 transition hover:text-red-200"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {success && (
              <div className="flex items-start justify-between gap-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                <span>{success}</span>

                <button
                  type="button"
                  onClick={() => setSuccess("")}
                  className="shrink-0 text-emerald-200/60 transition hover:text-emerald-200"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {isFormOpen && (
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingId
                    ? "Edit Service"
                    : "Create Service"}
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  Configure the service information and
                  icon.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="service-name"
                      className="mb-2 block text-sm font-medium text-white/70"
                    >
                      Service Name
                    </label>

                    <input
                      id="service-name"
                      type="text"
                      value={form.name}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Full-Stack Development"
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/25 focus:bg-white/5"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="service-description"
                      className="mb-2 block text-sm font-medium text-white/70"
                    >
                      Description
                    </label>

                    <textarea
                      id="service-description"
                      rows={6}
                      value={form.description}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          description:
                            event.target.value,
                        }))
                      }
                      placeholder="Describe what this service includes..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/25 focus:bg-white/5"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="service-sort-order"
                      className="mb-2 block text-sm font-medium text-white/70"
                    >
                      Sort Order
                    </label>

                    <input
                      id="service-sort-order"
                      type="number"
                      min={0}
                      value={form.sortOrder}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          sortOrder: Number(
                            event.target.value,
                          ),
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25 focus:bg-white/5"
                    />
                  </div>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-white/80">
                        Active Service
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        Show this service on the public
                        portfolio.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          isActive:
                            event.target.checked,
                        }))
                      }
                      className="h-5 w-5 accent-white"
                    />
                  </label>
                </div>

                <div>
                  <IconPicker
                    value={form.icon}
                    onChange={(value) =>
                      setForm((previous) => ({
                        ...previous,
                        icon: value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
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

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-56 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]"
                />
              ),
            )}
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <BriefcaseBusiness
                size={24}
                className="text-white/40"
              />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              No services yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-white/40">
              Add your first service to start building
              your portfolio services section.
            </p>

            <button
              type="button"
              onClick={startCreate}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Add Your First Service
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl transition hover:border-white/15 hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white">
                    <ServiceIcon
                      value={service.icon}
                      size={22}
                    />
                  </div>

                  <div
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      service.isActive
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 bg-white/5 text-white/35"
                    }`}
                  >
                    {service.isActive
                      ? "Active"
                      : "Inactive"}
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-lg font-semibold text-white">
                    {service.name}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/45">
                    {service.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="text-xs text-white/30">
                    Order: {service.sortOrder}
                  </div>

                  <div className="text-xs text-white/30">
                    {getIconOption(service.icon).label}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      startEdit(service)
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleActive(service)
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    {service.isActive
                      ? "Disable"
                      : "Enable"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(service.id)
                    }
                    disabled={
                      deletingId === service.id
                    }
                    className="rounded-xl border border-red-400/10 bg-red-500/5 px-3 py-2.5 text-xs font-medium text-red-300/70 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {deletingId === service.id
                      ? "..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
