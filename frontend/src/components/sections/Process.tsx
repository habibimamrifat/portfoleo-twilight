"use client";

import Card from "../common/util/Card";
import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type ProcessStep = {
  id: string;
  name: string;
  detail: string;
  sortOrder: number;
};

const defaultSteps: ProcessStep[] = [
  {
    id: "understand",
    name: "Understand",
    detail:
      "Understand the business, users, requirements and technical constraints.",
    sortOrder: 1,
  },
  {
    id: "plan",
    name: "Plan",
    detail:
      "Break the requirements into features, architecture, data models and development tasks.",
    sortOrder: 2,
  },
  {
    id: "build",
    name: "Build",
    detail:
      "Develop the system incrementally with clean, maintainable and testable code.",
    sortOrder: 3,
  },
  {
    id: "improve",
    name: "Improve",
    detail:
      "Test, review, optimize and prepare the application for real-world usage.",
    sortOrder: 4,
  },
  {
    id: "deliver",
    name: "Deliver",
    detail:
      "Deploy the completed product and provide the foundation for future improvements.",
    sortOrder: 5,
  },
];

export default function Process() {
  const [steps, setSteps] =
    useState<ProcessStep[]>(defaultSteps);

  useEffect(() => {
    async function getProcessSteps() {
      try {
        const response = await fetch(
          `${BASE_URL}/process-steps`,
        );

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        if (
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          setSteps(result.data);
        }
      } catch {
        setSteps(defaultSteps);
      }
    }

    getProcessSteps();
  }, []);

  return (
    <section
      id="process"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Process
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            How I approach a project.
          </h2>
        </div>

        <div className="grid gap-4">
          {steps.map((step, index) => (
            <Card
              key={step.id}
              className="flex gap-5 p-6"
            >
              <span className="text-2xl font-bold text-blue-400/60">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3 className="font-semibold">
                  {step.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  {step.detail}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}