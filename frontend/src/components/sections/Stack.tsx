"use client";

import Card from "../common/Card";
import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Tool = {
  id: string;
  name: string;
  logo?: string | null;
  description?: string | null;
  category: string;
  sortOrder: number;
};

const defaultTools: Tool[] = [
  {
    id: "react",
    name: "React",
    logo: null,
    description: null,
    category: "FRONTEND",
    sortOrder: 1,
  },
  {
    id: "nextjs",
    name: "Next.js",
    logo: null,
    description: null,
    category: "FRONTEND",
    sortOrder: 2,
  },
  {
    id: "typescript",
    name: "TypeScript",
    logo: null,
    description: null,
    category: "FRONTEND",
    sortOrder: 3,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    logo: null,
    description: null,
    category: "FRONTEND",
    sortOrder: 4,
  },
  {
    id: "nodejs",
    name: "Node.js",
    logo: null,
    description: null,
    category: "BACKEND",
    sortOrder: 1,
  },
  {
    id: "express",
    name: "Express",
    logo: null,
    description: null,
    category: "BACKEND",
    sortOrder: 2,
  },
  {
    id: "nestjs",
    name: "NestJS",
    logo: null,
    description: null,
    category: "BACKEND",
    sortOrder: 3,
  },
  {
    id: "rest-api",
    name: "REST API",
    logo: null,
    description: null,
    category: "BACKEND",
    sortOrder: 4,
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    logo: null,
    description: null,
    category: "DATABASE",
    sortOrder: 1,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    logo: null,
    description: null,
    category: "DATABASE",
    sortOrder: 2,
  },
  {
    id: "prisma",
    name: "Prisma",
    logo: null,
    description: null,
    category: "DATABASE",
    sortOrder: 3,
  },
  {
    id: "git",
    name: "Git",
    logo: null,
    description: null,
    category: "TOOLS",
    sortOrder: 1,
  },
  {
    id: "github",
    name: "GitHub",
    logo: null,
    description: null,
    category: "TOOLS",
    sortOrder: 2,
  },
  {
    id: "docker",
    name: "Docker",
    logo: null,
    description: null,
    category: "TOOLS",
    sortOrder: 3,
  },
  {
    id: "postman",
    name: "Postman",
    logo: null,
    description: null,
    category: "TOOLS",
    sortOrder: 4,
  },
];

const categoryNames: Record<string, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DATABASE: "Database",
  TOOLS: "Tools",
};

export default function Stack() {
  const [tools, setTools] =
    useState<Tool[]>(defaultTools);

  useEffect(() => {
    async function getTools() {
      try {
        const response = await fetch(
          `${BASE_URL}/tools`,
        );

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        if (
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          setTools(result.data);
        }
      } catch {
        setTools(defaultTools);
      }
    }

    getTools();
  }, []);

  const stack = tools.reduce<Record<string, Tool[]>>(
    (groups, tool) => {
      if (!groups[tool.category]) {
        groups[tool.category] = [];
      }

      groups[tool.category].push(tool);

      return groups;
    },
    {},
  );

  return (
    <section
      id="stack"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Technology Stack
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Tools I work with.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(stack).map(
            ([category, technologies]) => (
              <Card
                key={category}
                className="p-6"
              >
                <h3 className="font-semibold">
                  {categoryNames[category] ?? category}
                </h3>

                <div className="mt-5 flex flex-wrap gap-2">
                  {technologies
                    .sort(
                      (a, b) =>
                        a.sortOrder - b.sortOrder,
                    )
                    .map((tool) => (
                      <span
                        key={tool.id}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60"
                      >
                        {tool.name}
                      </span>
                    ))}
                </div>
              </Card>
            ),
          )}
        </div>
      </div>
    </section>
  );
}