"use client";

import Card from "../common/Card";
import {
  Code2,
  Server,
  Database,
  Layers3,
} from "lucide-react";

const strengths = [
  {
    title: "Frontend",
    description:
      "Building responsive and interactive interfaces with React, Next.js and modern CSS.",
    icon: Code2,
  },
  {
    title: "Backend",
    description:
      "Designing APIs and backend systems with Node.js, Express and NestJS.",
    icon: Server,
  },
  {
    title: "Database",
    description:
      "Working with PostgreSQL, MongoDB, Prisma and structured data models.",
    icon: Database,
  },
  {
    title: "Architecture",
    description:
      "Learning and applying scalable architecture, modular systems and clean backend design.",
    icon: Layers3,
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            About Me
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Building with purpose.
          </h2>
        </div>

        <Card className="p-8">
          <p className="max-w-3xl text-base leading-8 text-white/60">
            I am a full-stack developer with a strong interest in
            backend engineering and system architecture. I enjoy
            understanding how applications work beyond the UI and
            designing systems that remain maintainable as they grow.
          </p>

          <p className="mt-5 max-w-3xl text-base leading-8 text-white/60">
            My current focus is becoming stronger in backend
            development, distributed systems, system design and
            production-ready application architecture.
          </p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {strengths.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="p-6"
              >
                <Icon
                  size={24}
                  className="text-blue-400"
                />

                <h3 className="mt-4 font-semibold">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}