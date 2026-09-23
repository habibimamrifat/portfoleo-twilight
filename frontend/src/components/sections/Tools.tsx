
"use client";

import Card from "../common/util/Card";
import { useEffect, useState } from "react";

import { getApi } from "@/api/getapi";

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
  DEVTOOLS: "Dev Tools",
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
          throw new Error(
            result?.message || "Failed to fetch tools",
          );
        }

        const toolsData: Tool[] = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        setTools(toolsData);
      } catch (error) {
        console.error(
          "Failed to fetch tools:",
          error,
        );
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
    categoryTools.sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  });

  return (
    <section
      id="tools"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Tools
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Tools I work with.
          </h2>
        </div>

        {loading ? (
          <div className="py-10 text-sm text-white/40">
            Loading tools...
          </div>
        ) : tools.length === 0 ? (
          <div className="py-10 text-sm text-white/40">
            No tools available.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(groupedTools).map(
              ([category, categoryTools]) => (
                <Card
                  key={category}
                  className="p-5"
                >
                  <h3 className="mb-4 text-sm font-semibold text-white/70">
                    {categoryNames[category] ?? category}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {categoryTools.map((tool) => (
                      <Card
                        key={tool.id}
                        className="
                          flex items-center gap-2
                          px-3 py-2
                        "
                      >
                        {tool.logo ? (
                          <img
                            src={tool.logo}
                            alt={tool.name}
                            className="h-4 w-4 object-contain"
                          />
                        ) : (
                          <div className="h-4 w-4 rounded-sm bg-white/5" />
                        )}

                        <span className="text-xs text-white/60">
                          {tool.name}
                        </span>
                      </Card>
                    ))}
                  </div>
                </Card>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

