"use client";

import { useEffect, useState } from "react";

import { getApi } from "@/api/getapi";
import Appear from "@/components/common/animation/Appear";

type Tool = {
  id: string;
  name: string;
  logo?: string | null;
  description?: string | null;
  category: string;
  sortOrder: number;
};

const categoryNames: Record<string, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DATABASE: "Database",
  DEVTOOLS: "Development Tools",
  DEVOPS: "DevOps",
  DESIGN: "Design",
  OTHER: "Other",
};

export default function Tools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchTools = async () => {
      try {
        const response = await getApi("/tools");
        const result = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          throw new Error(result?.message || "Failed to fetch tools");
        }

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

  const groupedTools = tools.reduce<Record<string, Tool[]>>(
    (groups, tool) => {
      if (!groups[tool.category]) {
        groups[tool.category] = [];
      }

      groups[tool.category].push(tool);

      return groups;
    },
    {},
  );

  Object.values(groupedTools).forEach((categoryTools) => {
    categoryTools.sort((a, b) => a.sortOrder - b.sortOrder);
  });

  return (
    <section id="stack" className="px-6 py-20 lg:px-10">
      <div className="space-y-10">
        <Appear>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
              Technologies
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Tools I work with.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
              Technologies and tools I use to build, develop, and maintain
              web applications.
            </p>
          </div>
        </Appear>

        {loading ? (
          <div className="py-10 text-sm text-white/40">
            Loading tools...
          </div>
        ) : tools.length === 0 ? (
          <div className="py-10 text-sm text-white/40">
            No tools available.
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedTools).map(
              ([category, categoryTools], categoryIndex) => (
                <Appear
                  key={category}
                  direction="none"
                  delay={categoryIndex * 0.15}
                >
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                        {categoryNames[category] ?? category}
                      </h3>

                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                      {categoryTools.map((tool, toolIndex) => (
                        <Appear
                          key={tool.id}
                          direction="none"
                          delay={toolIndex * 0.04}
                        >
                          <div
                            title={tool.description || tool.name}
                            className="group flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-xl px-2 py-4 text-center transition duration-300 hover:bg-white/[0.04]"
                          >
                            <div className="flex h-12 w-12 items-center justify-center transition duration-300 group-hover:scale-110">
                              {tool.logo ? (
                                <img
                                  src={tool.logo}
                                  alt={tool.name}
                                  loading="lazy"
                                  className="h-10 w-10 object-contain"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-white/60">
                                  {tool.name.slice(0, 1).toUpperCase()}
                                </div>
                              )}
                            </div>

                            <span className="text-xs font-medium leading-5 text-white/65 transition-colors group-hover:text-white sm:text-sm">
                              {tool.name}
                            </span>
                          </div>
                        </Appear>
                      ))}
                    </div>
                  </div>
                </Appear>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}