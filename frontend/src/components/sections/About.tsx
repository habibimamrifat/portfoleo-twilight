"use client";

import Appear from "../common/animation/Appear";
import AboutMe from "../common/Profile/aboutMe/AboutMe";
import WorkSectorList from "../common/Profile/workSector/WorkSectorList";

export default function About() {
  return (
    <section
      id="about"
      className="px-6 py-20 lg:px-10"
    >
      <div className="space-y-6">
        <Appear>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
              About Me
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Building with purpose.
            </h2>
          </div>
        </Appear>

        <AboutMe />

        <WorkSectorList />
      </div>
    </section>
  );
}