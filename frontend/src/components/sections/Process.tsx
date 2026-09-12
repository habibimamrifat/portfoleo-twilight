"use client";

import Card from "../common/Card";

const steps = [
  {
    number: "01",
    title: "Understand",
    description:
      "Understand the business, users, requirements and technical constraints.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "Break the requirements into features, architecture, data models and development tasks.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Develop the system incrementally with clean, maintainable and testable code.",
  },
  {
    number: "04",
    title: "Improve",
    description:
      "Test, review, optimize and prepare the application for real-world usage.",
  },
  {
    number: "05",
    title: "Deliver",
    description:
      "Deploy the completed product and provide the foundation for future improvements.",
  },
];

export default function Process() {
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
          {steps.map((step) => (
            <Card
              key={step.number}
              className="flex gap-5 p-6"
            >
              <span className="text-2xl font-bold text-blue-400/60">
                {step.number}
              </span>

              <div>
                <h3 className="font-semibold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  {step.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}