"use client";

import Image from "next/image";
import Card from "../common/util/Card";
import {
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import Appear from "../common/animation/Appear";
import HeadingSlider from "../common/Profile/Banner/HeadingSlider";
import SecondaryTextSlider from "../common/Profile/Banner/SecondaryTextSlider";



const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const EXPERIENCE_START_DATE = new Date(
  "2025-01-18T00:00:00",
);

type UserData = {
  name?: string;
  img?: string | null;
  description?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
};

interface BannerQuote {
  id: string;
  primaryText: string[];
  secondaryText: string[];
}

const defaultUser: UserData = {
  name: "Habib Rifat",
  img: "/profilePic.jpg",
  description:
    "Backend-focused full-stack developer specializing in reliable APIs, scalable architectures, and modern web experiences.",
  githubUrl: null,
  linkedinUrl: null,
  youtubeUrl: null,
};

function calculateExperience() {
  const now = new Date();

  const difference =
    now.getTime() -
    EXPERIENCE_START_DATE.getTime();

  const years =
    difference /
    (1000 * 60 * 60 * 24 * 365.25);

  return `${years.toFixed(1)}+`;
}

export default function Home() {
  const { openPopup } = useApp();

  const [user, setUser] =
    useState<UserData>(defaultUser);

  const [banner, setBanner] =
    useState<BannerQuote | null>(null);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch(
          `${BASE_URL}/users/get-me`,
        );

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        setUser({
          ...defaultUser,
          ...result.data,
        });
      } catch {
        setUser(defaultUser);
      }
    }

    getUser();
  }, []);

  useEffect(() => {
    async function getBanner() {
      try {
        const response = await fetch(
          `${BASE_URL}/banner-quote`,
        );

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        setBanner(
          result.data ?? result,
        );
      } catch {
        setBanner(null);
      }
    }

    getBanner();
  }, []);

  const profileImage: string =
    user.img || defaultUser.img!;

  const name: string =
    user.name || defaultUser.name!;

  const description: string =
    user.description ||
    defaultUser.description!;

  const experience = calculateExperience();

  return (
    <section id="home">
      {/* =====================================================
          MOBILE / TABLET
      ===================================================== */}
      <div className="mt-18 w-full space-y-6 px-6 lg:px-10 xl:hidden">
        {/* Hero */}
        <Appear>
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
                  src={profileImage}
                  alt={name}
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

              {/* Heading Slider */}
              {banner && (
                <HeadingSlider
                  texts={banner.primaryText}
                />
              )}

              {/* Secondary Text Slider */}
              {banner && (
                <div className="mt-5 max-w-xl">
                  <SecondaryTextSlider
                    texts={
                      banner.secondaryText
                    }
                  />
                </div>
              )}

              {/* Fallback Description */}
              {!banner && (
                <p className="mt-5 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
                  {description}
                </p>
              )}

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

              {/* Social Links */}
              <div className="mt-6 flex items-center justify-center gap-3">
                {user.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      text-white/60
                      backdrop-blur-md
                      transition
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    <FaGithub size={20} />
                  </a>
                )}

                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      text-white/60
                      backdrop-blur-md
                      transition
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    <FaLinkedin size={20} />
                  </a>
                )}

                {user.youtubeUrl && (
                  <a
                    href={user.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      text-white/60
                      backdrop-blur-md
                      transition
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    <FaYoutube size={20} />
                  </a>
                )}
              </div>
            </div>
          </Card>
        </Appear>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {/* Years Experience */}
          <Appear direction="left" delay={0.6}>
            <Card className="p-5">
              <p className="text-2xl font-bold">
                {experience}
              </p>

              <p className="mt-1 text-xs text-white/50">
                Years Experience
              </p>
            </Card>
          </Appear>

          {/* Projects Built */}
          <Appear direction="left" delay={0.3}>
            <Card className="p-5">
              <p className="text-2xl font-bold">
                20+
              </p>

              <p className="mt-1 text-xs text-white/50">
                Projects Built
              </p>
            </Card>
          </Appear>

          {/* Technologies */}
          <Appear direction="right" delay={0.3}>
            <Card className="p-5">
              <p className="text-2xl font-bold">
                10+
              </p>

              <p className="mt-1 text-xs text-white/50">
                Technologies
              </p>
            </Card>
          </Appear>

          {/* Learning Mindset */}
          <Appear direction="right" delay={0.9}>
            <Card className="p-5">
              <p className="text-2xl font-bold">
                100%
              </p>

              <p className="mt-1 text-xs text-white/50">
                Learning Mindset
              </p>
            </Card>
          </Appear>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center pt-2">
          <ArrowDown
            size={20}
            className="animate-bounce text-white/30"
          />
        </div>
      </div>

      {/* =====================================================
          DESKTOP
      ===================================================== */}
      <div className="hidden w-full space-y-6 xl:mt-5 xl:block">
        {/* Hero */}
        <Appear>
          <Card className="overflow-hidden p-8 lg:p-12">
            <div className="max-w-3xl">
              {/* Intro */}
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
                Full-Stack Developer
              </p>

              {/* Heading Slider */}
              {banner && (
                <HeadingSlider
                  texts={banner.primaryText}
                />
              )}

              {/* Secondary Text Slider */}
              {banner && (
                <div className="mt-6 max-w-2xl">
                  <SecondaryTextSlider
                    texts={
                      banner.secondaryText
                    }
                  />
                </div>
              )}

              {/* Fallback Description */}
              {!banner && (
                <p className="mt-6 max-w-2xl text-base leading-7 text-white/60">
                  {description}
                </p>
              )}

              {/* Buttons */}
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

              {/* Social Links */}
              <div className="mt-6 flex items-center gap-3">
                {user.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      text-white/60
                      backdrop-blur-md
                      transition
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    <FaGithub size={20} />
                  </a>
                )}

                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      text-white/60
                      backdrop-blur-md
                      transition
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    <FaLinkedin size={20} />
                  </a>
                )}

                {user.youtubeUrl && (
                  <a
                    href={user.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      text-white/60
                      backdrop-blur-md
                      transition
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    <FaYoutube size={20} />
                  </a>
                )}
              </div>
            </div>
          </Card>
        </Appear>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Years Experience */}
          <Appear direction="left" delay={0.6}>
            <Card className="p-5">
              <p className="text-2xl font-bold">
                {experience}
              </p>

              <p className="mt-1 text-xs text-white/50">
                Years Experience
              </p>
            </Card>
          </Appear>

          {/* Projects Built */}
          <Appear direction="left" delay={0.3}>
            <Card className="p-5">
              <p className="text-2xl font-bold">
                20+
              </p>

              <p className="mt-1 text-xs text-white/50">
                Projects Built
              </p>
            </Card>
          </Appear>

          {/* Technologies */}
          <Appear direction="right" delay={0.3}>
            <Card className="p-5">
              <p className="text-2xl font-bold">
                10+
              </p>

              <p className="mt-1 text-xs text-white/50">
                Technologies
              </p>
            </Card>
          </Appear>

          {/* Learning Mindset */}
          <Appear direction="right" delay={0.9}>
            <Card className="p-5">
              <p className="text-2xl font-bold">
                100%
              </p>

              <p className="mt-1 text-xs text-white/50">
                Learning Mindset
              </p>
            </Card>
          </Appear>
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