"use client";

import Card from "../common/Card";

const stack = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  Backend: ["Node.js", "Express", "NestJS", "REST API"],
  Database: ["PostgreSQL", "MongoDB", "Prisma"],
  Tools: ["Git", "GitHub", "Docker", "Postman"],
};

export default function Stack() {
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
          {Object.entries(stack).map(([category, technologies]) => (
            <Card
              key={category}
              className="p-6"
            >
              <h3 className="font-semibold">
                {category}
              </h3>

              <div className="mt-5 flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}