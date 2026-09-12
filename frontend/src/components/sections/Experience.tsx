"use client";

import Card from "../common/Card";

const experiences = [
  {
    role: "Full-Stack Developer",
    company: "Current / Freelance",
    period: "2025 — Present",
    description:
      "Building full-stack applications with a strong focus on backend development, APIs and scalable architecture.",
  },
  {
    role: "Team Lead",
    company: "Previous Organization",
    period: "2025 — 2026",
    description:
      "Worked closely with developers, coordinated development tasks and contributed to technical decisions.",
  },
  {
    role: "Developer",
    company: "Previous Organization",
    period: "2025",
    description:
      "Developed web applications and backend functionality while working with modern JavaScript technologies.",
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Experience
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            My professional journey.
          </h2>
        </div>

        <div className="space-y-4">
          {experiences.map((experience) => (
            <Card
              key={`${experience.role}-${experience.period}`}
              className="p-7"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {experience.role}
                  </h3>

                  <p className="mt-1 text-sm text-blue-400">
                    {experience.company}
                  </p>
                </div>

                <span className="text-xs text-white/40">
                  {experience.period}
                </span>
              </div>

              <p className="mt-5 text-sm leading-7 text-white/50">
                {experience.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}