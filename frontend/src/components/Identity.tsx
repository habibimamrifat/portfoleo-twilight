"use client";

import Image from "next/image";
import Card from "./common/Card";
import PopupCard from "./common/PopUp";
import { useApp } from "./context/AppContext";
import { useEffect, useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

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

const defaultUser: UserData = {
  name: "Habib Rifat",
  img: "/profilePic.jpg",
  description:
    "Backend-focused developer building scalable, reliable and production-ready web applications.",
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

  return years.toFixed(1);
}

export default function Identity() {
  const {
    isPopupOpen,
    openPopup,
    closePopup,
  } = useApp();

  const [user, setUser] =
    useState<UserData>(defaultUser);

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

        console.log(
          "Portfolio user:",
          result,
        );

        const userData =
          result.data ?? result;

        setUser({
          ...defaultUser,
          ...userData,
        });
      } catch (error) {
        console.error(
          "Failed to load portfolio user:",
          error,
        );

        setUser(defaultUser);
      }
    }

    getUser();
  }, []);

  const profileImage =
    user.img || defaultUser.img!;

  const name =
    user.name || defaultUser.name!;

  const description =
    user.description ||
    defaultUser.description!;

  const experience =
    calculateExperience();

  return (
    <>
      <Card className="min-h-auto overflow-hidden bg-white/10">
        <div className="flex h-full flex-col justify-between p-6">
          {/* =====================================================
              PROFILE
              ===================================================== */}
          <div>
            <button
              type="button"
              onClick={openPopup}
              className="
                group
                relative
                mx-auto
                mb-6
                block
                h-52
                w-52
                overflow-hidden
                rounded-3xl
              "
            >
              <Image
                src={profileImage}
                alt={name}
                fill
                priority
                sizes="208px"
                className="
                  object-cover
                  transition
                  duration-500
                  group-hover:scale-105
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  bg-black/0
                  transition
                  duration-300
                  group-hover:bg-black/40
                "
              >
                <span
                  className="
                    rounded-full
                    border
                    border-white/20
                    bg-black/30
                    px-4
                    py-2
                    text-sm
                    text-white
                    opacity-0
                    backdrop-blur-sm
                    transition
                    duration-300
                    group-hover:opacity-100
                  "
                >
                  View Profile
                </span>
              </div>
            </button>

            {/* ===================================================
                IDENTITY
                =================================================== */}
            <div className="text-center">
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-blue-400">
                Full-Stack Developer
              </p>

              <h1 className="text-3xl font-bold tracking-tight">
                {name}
              </h1>

              <p className="mt-3 text-sm leading-6 text-white/60">
                {description}
              </p>
            </div>

            {/* ===================================================
                SOCIAL LINKS
                =================================================== */}
            <div className="mt-6 flex items-center justify-center gap-3">
              {/* GitHub */}
              {user.githubUrl && (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    text-white/60
                    backdrop-blur-md
                    transition
                    duration-300
                    hover:scale-105
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <FaGithub size={21} />
                </a>
              )}

              {/* LinkedIn */}
              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    text-white/60
                    backdrop-blur-md
                    transition
                    duration-300
                    hover:scale-105
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <FaLinkedin size={21} />
                </a>
              )}

              {/* YouTube */}
              {user.youtubeUrl && (
                <a
                  href={user.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    text-white/60
                    backdrop-blur-md
                    transition
                    duration-300
                    hover:scale-105
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <FaYoutube size={21} />
                </a>
              )}
            </div>
          </div>

          {/* =====================================================
              EXPERIENCE
              ===================================================== */}
          <div className="mt-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Experience
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {experience}
                    <span className="text-blue-400">
                      +
                    </span>
                  </p>

                  <p className="text-sm text-white/50">
                    Years of development
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-white/40">
                    Started
                  </p>

                  <p className="mt-1 text-sm font-medium text-white/80">
                    Jan 2025
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-sm italic leading-6 text-white/50">
              “Build things that matter. Keep learning. Keep moving forward.”
            </p>
          </div>
        </div>
      </Card>

      {/* =======================================================
          PROFILE POPUP
          ======================================================= */}
      <PopupCard
        isOpen={isPopupOpen}
        onClose={closePopup}
      >
        <div className="relative h-[80vh] w-[80vw] max-w-4xl">
          <Image
            src={profileImage}
            alt={name}
            fill
            sizes="80vw"
            className="rounded-2xl object-contain"
          />
        </div>
      </PopupCard>
    </>
  );
}