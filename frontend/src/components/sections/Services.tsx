"use client";

import Card from "../common/util/Card";
import {
  Globe,
  ServerCog,
  Database,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Service = {
  id: string;
  name: string;
  description: string;
  icon?: string | null;
  sortOrder: number;
};

const iconMap = {
  Globe,
  ServerCog,
  Database,
  Wrench,
};

const defaultServices: Service[] = [
  {
    id: "1",
    name: "Full-Stack Development",
    description:
      "Complete web applications from frontend interfaces to backend APIs and databases.",
    icon: "Globe",
    sortOrder: 1,
  },
  {
    id: "2",
    name: "Backend Development",
    description:
      "REST APIs, authentication, business logic, database integration and backend architecture.",
    icon: "ServerCog",
    sortOrder: 2,
  },
  {
    id: "3",
    name: "Database Design",
    description:
      "Structured relational and NoSQL data models designed around application requirements.",
    icon: "Database",
    sortOrder: 3,
  },
  {
    id: "4",
    name: "Existing System Improvement",
    description:
      "Refactoring, debugging and improving existing applications and backend systems.",
    icon: "Wrench",
    sortOrder: 4,
  },
];

export default function Services() {
  const [services, setServices] =
    useState<Service[]>(defaultServices);

  useEffect(() => {
    async function getServices() {
      try {
        const response = await fetch(
          `${BASE_URL}/services`,
        );

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        if (
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          setServices(result.data);
        }
      } catch {
        setServices(defaultServices);
      }
    }

    getServices();
  }, []);

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
            const Icon =
              iconMap[
                service.icon as keyof typeof iconMap
              ] || Wrench;

            return (
              <Card
                key={service.id}
                className="p-7 transition duration-300 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Icon
                    size={22}
                    className="text-blue-400"
                  />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {service.name}
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