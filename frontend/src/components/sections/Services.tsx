"use client";

import Card from "../common/util/Card";
import {
  Globe,
  ServerCog,
  Database,
  Wrench,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import * as SimpleIcons from "react-icons/si";
import { useEffect, useState } from "react";
import Appear from "../common/animation/Appear";

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

// DYNAMIC ICON CHANGE: Resolves icons selected in the dashboard.
const getDynamicIcon = (value?: string | null) => {
  if (!value) return Wrench;

  const [prefix, ...parts] = value.split(":");
  const name = parts.join(":");

  if (prefix === "lucide") {
    const Icon = (
      LucideIcons as unknown as Record<string, React.ElementType>
    )[name];

    if (Icon) return Icon;
  }

  if (prefix === "si") {
    const Icon = (
      SimpleIcons as unknown as Record<string, React.ElementType>
    )[name];

    if (Icon) return Icon;
  }

  // Supports existing icon names such as "Globe" and "Database".
  const LegacyIcon = (
    iconMap as Record<string, React.ElementType>
  )[value];

  if (LegacyIcon) return LegacyIcon;

  return Wrench;
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
        const response = await fetch(`${BASE_URL}/services`);

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
        {/* Section Header */}
        <Appear>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
              Services
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              What I can build.
            </h2>
          </div>
        </Appear>

        {/* Services */}
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service, index) => {
            // DYNAMIC ICON CHANGE: Uses the dashboard-selected icon.
            const Icon = getDynamicIcon(service.icon);

            return (
              <Appear
                key={service.id}
                direction="none"
                delay={index * 0.5}
              >
                <Card className="h-full p-7 transition duration-300 hover:bg-white/10">
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
              </Appear>
            );
          })}
        </div>
      </div>
    </section>
  );
}
