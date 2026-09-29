"use client";

import ExperienceList from "@/components/common/experience/ExperienceList";



export default function ExperiencePage() {
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

          <h1 className="mt-2 text-3xl font-bold text-white">
            My professional journey.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            A detailed look at my professional experience,
            responsibilities and what I learned along the way.
          </p>
        </div>

        <ExperienceList
         />
      </div>
    </section>
  );
}