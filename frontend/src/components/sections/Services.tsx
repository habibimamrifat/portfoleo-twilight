"use client";

import Card from "../common/Card";
import {
  Globe,
  ServerCog,
  Database,
  Wrench,
} from "lucide-react";

const services = [
  {
    title: "Full-Stack Development",
    description:
      "Complete web applications from frontend interfaces to backend APIs and databases.",
    icon: Globe,
  },
  {
    title: "Backend Development",
    description:
      "REST APIs, authentication, business logic, database integration and backend architecture.",
    icon: ServerCog,
  },
  {
    title: "Database Design",
    description:
      "Structured relational and NoSQL data models designed around application requirements.",
    icon: Database,
  },
  {
    title: "Existing System Improvement",
    description:
      "Refactoring, debugging and improving existing applications and backend systems.",
    icon: Wrench,
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Services
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            What I can build.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Card
                key={service.title}
                className="p-7 transition duration-300 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Icon
                    size={22}
                    className="text-blue-400"
                  />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/50">
                  {service.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}