"use client";

import Link from "next/link";

import ExperienceList from "../common/experience/ExperienceList";
import Appear from "../common/animation/Appear";

export default function Experience() {
  return (
    <section
      id="experience"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        {/* Section Header */}
        <Appear>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
                Experience
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                My professional journey.
              </h2>
            </div>

            {/* See All */}
            <Link
              href="/portfolio/experience"
              className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              See All
            </Link>
          </div>
        </Appear>

        {/* Experience List */}
        <ExperienceList isPortfolio />
      </div>
    </section>
  );
}