"use client";

import Card from "../common/util/Card";
import Image from "next/image";
import { useEffect, useState } from "react";

// ANIMATION: Added Motion for scroll-based entrance animations.
import { motion } from "motion/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type ProcessStep = {
  id: string;
  name: string;
  detail: string;
  img?: string | null;
  sortOrder: number;
};

const defaultSteps: ProcessStep[] = [
  {
    id: "understand",
    name: "Understand",
    detail:
      "Understand the business, users, requirements and technical constraints.",
    sortOrder: 1,
    img: null,
  },
  {
    id: "plan",
    name: "Plan",
    detail:
      "Break the requirements into features, architecture, data models and development tasks.",
    sortOrder: 2,
    img: null,
  },
  {
    id: "build",
    name: "Build",
    detail:
      "Develop the system incrementally with clean, maintainable and testable code.",
    sortOrder: 3,
    img: null,
  },
  {
    id: "improve",
    name: "Improve",
    detail:
      "Test, review, optimize and prepare the application for real-world usage.",
    sortOrder: 4,
    img: null,
  },
  {
    id: "deliver",
    name: "Deliver",
    detail:
      "Deploy the completed product and provide the foundation for future improvements.",
    sortOrder: 5,
    img: null,
  },
];

function getImageUrl(
  image?: string | null,
) {
  if (!image) {
    return null;
  }

  const trimmed = image.trim();

  if (!trimmed) {
    return null;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/${trimmed}`;
}

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

        const data =
          result?.data?.data ??
          result?.data ??
          result;

        if (
          Array.isArray(data) &&
          data.length > 0
        ) {
          setSteps(data);
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
        {/* Section Header */}
        {/* ANIMATION: Header now fades and slides upward when Process
            enters the viewport. */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
        >
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
            Process
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            How I approach a project.
          </h2>
        </motion.div>

        {/* Process Grid */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          {steps.map((step, index) => {
            const imageUrl = getImageUrl(
              step.img,
            );

            return (
              // ANIMATION: Each card is now wrapped with Motion so
              // the cards can appear one after another.
              <motion.div
                key={step.id}
                initial={{
                  opacity: 0,
                  y: 70,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.7,

                  // ANIMATION: Creates the stagger effect.
                  // Card 1 = 0s
                  // Card 2 = 0.15s
                  // Card 3 = 0.30s
                  // Card 4 = 0.45s
                  // Card 5 = 0.60s
                  delay: index * 0.15,

                  ease: "easeOut",
                }}
              >
                <Card className="group flex min-h-[560px] h-full flex-col overflow-hidden">
                  {/* Step Image */}
                  <div className="relative min-h-[280px] w-full flex-1 overflow-hidden bg-white/5">
                    {imageUrl ? (
                      <>
                        <Image
                          src={imageUrl}
                          alt={step.name}
                          fill
                          unoptimized
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />

                        <div className="absolute inset-0 bg-black/20" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <motion.span
                            className="block text-7xl font-bold tracking-tight text-blue-400/20 transition duration-500 group-hover:text-blue-400/30"
                            whileHover={{
                              scale: 1.08,
                            }}
                            transition={{
                              duration: 0.3,
                            }}
                          >
                            {String(
                              index + 1,
                            ).padStart(2, "0")}
                          </motion.span>

                          <span className="mt-2 block text-xs uppercase tracking-[0.3em] text-white/25">
                            Step {index + 1}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex min-w-0 flex-1 flex-col p-7">
                    {/* Step Number */}
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/30">
                      Step{" "}
                      {String(index + 1).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    {/* Name */}
                    <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">
                      {step.name}
                    </h3>

                    {/* Detail */}
                    <p className="mt-4 line-clamp-5 text-sm leading-7 text-white/45">
                      {step.detail}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}