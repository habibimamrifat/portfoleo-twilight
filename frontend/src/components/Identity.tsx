"use client";

import Image from "next/image";
import Card from "./common/Card";
import PopupCard from "./common/PopUp";
import { useApp } from "./context/AppContext";


export default function Identity() {
  const { isPopupOpen, openPopup, closePopup } = useApp();

  return (
    <>
      <Card className="min-h-auto overflow-hidden bg-white/10">
        <div className="flex h-full flex-col justify-between p-6">

          {/* Profile */}
          <div>
            <button
              type="button"
              onClick={openPopup}
              className="group relative mx-auto mb-6 block h-52 w-52 overflow-hidden rounded-3xl"
            >
              <Image
                src="/profilePic.jpg"
                alt="Habib Rifat"
                fill
                priority
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/40">
                <span className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100">
                  View Profile
                </span>
              </div>
            </button>

            {/* Identity */}
            <div className="text-center">
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-blue-400">
                Full-Stack Developer
              </p>

              <h1 className="text-3xl font-bold tracking-tight">
                Habib Rifat
              </h1>

              <p className="mt-3 text-sm leading-6 text-white/60">
                Backend-focused developer building scalable, reliable and
                production-ready web applications.
              </p>
            </div>

            {/* Skills */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                Frontend
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                Backend
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                Next.js
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                Node.js
              </span>
            </div>
          </div>

          {/* Experience */}
          <div className="mt-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Experience
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    1.5<span className="text-blue-400">+</span>
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

      {/* Generic Popup */}
      <PopupCard
        isOpen={isPopupOpen}
        onClose={closePopup}
      >
        <div className="relative h-[80vh] w-[80vw] max-w-4xl">
          <Image
            src="/profilePic.jpg"
            alt="Habib Rifat"
            fill
            className="rounded-2xl object-contain"
          />
        </div>
      </PopupCard>
    </>
  );
}