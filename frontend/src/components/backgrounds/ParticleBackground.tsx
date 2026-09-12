"use client";

import Particles, {
  ParticlesProvider,
} from "@tsparticles/react";

import { loadSlim } from "@tsparticles/slim";

export default function ParticleBackground() {
  const init = async (engine: Parameters<typeof loadSlim>[0]) => {
    await loadSlim(engine);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-black">
      {/* Particles */}
      <ParticlesProvider init={init}>
        <Particles
          id="portfolio-particles"
          className="absolute inset-0 h-full w-full"
          options={{
            fullScreen: {
              enable: false,
            },

            fpsLimit: 60,

            particles: {
              number: {
                value: 300,
              },

              color: {
                value: "#ffffff",
              },

              opacity: {
                value: 1,
              },

              size: {
                value: {
                  min: 0,
                  max: 5,
                },
              },

              links: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.25,
                width: 1,
              },

              move: {
                enable: true,
                speed: 1,
                outModes: {
                  default: "out",
                },
              },
            },

            detectRetina: true,
          }}
        />
      </ParticlesProvider>

      {/* Soft Moonlight */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 75% 45%, rgba(100, 135, 190, 0.9) 0%, rgba(75, 105, 160, 0.82) 12%, rgba(45, 75, 125, 0.68) 25%, rgba(25, 50, 95, 0.52) 40%, rgba(10, 22, 48, 0.38) 58%, rgba(3, 8, 20, 0.2) 72%, #000000 90%)",
        }}
      />
    </div>
  );
}