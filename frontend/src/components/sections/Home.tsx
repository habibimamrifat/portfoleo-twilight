"use client";

import Image from "next/image";
import Card from "../common/Card";
import {
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Home() {
  const { openPopup } = useApp();

  return (
    <section id="home">
      {/* Mobile / Tablet Home */}
      <div className="mt-18 xl:mt-16 w-full space-y-6 xl:hidden px-6 lg:px-10">
        <Card className="overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            {/* Profile Image */}
            <button
              type="button"
              onClick={openPopup}
              aria-label="Open profile"
              className="
                relative
                mb-6
                h-40
                w-40
                overflow-hidden
                rounded-full
                border
                border-white/20
                shadow-2xl
                transition
                duration-300
                hover:scale-105
                sm:h-48
                sm:w-48
              "
            >
              <Image
                src="/profilePic.jpg"
                alt="Habib Rifat"
                fill
                sizes="(max-width: 640px) 160px, 192px"
                className="object-cover"
                priority
              />
            </button>

            {/* Intro */}
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
              Full-Stack Developer
            </p>

            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              I build modern
              <span className="text-blue-400">
                {" "}
                web applications
              </span>
              <br />
              that are built to grow.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
              Backend-focused full-stack developer specializing in
              reliable APIs, scalable architectures, and modern web
              experiences using Node.js, React, Next.js, and PostgreSQL.
            </p>

            {/* Buttons */}
            <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a
                href="#projects"
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/20
                  bg-white/10
                  px-5
                  py-3
                  text-sm
                  font-medium
                  backdrop-blur-md
                  transition
                  hover:bg-white/20
                "
              >
                View Projects
                <ArrowRight size={16} />
              </a>

              <a
                href="#contact"
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  px-5
                  py-3
                  text-sm
                  text-white/70
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                Lets Work Together
              </a>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {[
            ["1.5+", "Years Experience"],
            ["20+", "Projects Built"],
            ["10+", "Technologies"],
            ["100%", "Learning Mindset"],
          ].map(([value, label]) => (
            <Card key={label} className="p-5">
              <p className="text-2xl font-bold">
                {value}
              </p>

              <p className="mt-1 text-xs text-white/50">
                {label}
              </p>
            </Card>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center pt-2">
          <ArrowDown
            size={20}
            className="animate-bounce text-white/30"
          />
        </div>
      </div>

      {/* Desktop Home */}
      <div className="hidden w-full space-y-6 xl:mt-5 xl:block">
        <Card className="overflow-hidden p-8 lg:p-12">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
              Full-Stack Developer
            </p>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              I build modern
              <span className="text-blue-400">
                {" "}
                web applications
              </span>
              <br />
              that are built to grow.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/60">
              Backend-focused full-stack developer specializing in
              reliable APIs, scalable architectures, and modern web
              experiences using Node.js, React, Next.js, and PostgreSQL.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/20
                  bg-white/10
                  px-5
                  py-3
                  text-sm
                  font-medium
                  backdrop-blur-md
                  transition
                  hover:bg-white/20
                "
              >
                View Projects
                <ArrowRight size={16} />
              </a>

              <a
                href="#contact"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  px-5
                  py-3
                  text-sm
                  text-white/70
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                Lets Work Together
              </a>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ["1.5+", "Years Experience"],
            ["20+", "Projects Built"],
            ["10+", "Technologies"],
            ["100%", "Learning Mindset"],
          ].map(([value, label]) => (
            <Card key={label} className="p-5">
              <p className="text-2xl font-bold">
                {value}
              </p>

              <p className="mt-1 text-xs text-white/50">
                {label}
              </p>
            </Card>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center pt-4">
          <ArrowDown
            size={20}
            className="animate-bounce text-white/30"
          />
        </div>
      </div>
    </section>
  );
}
