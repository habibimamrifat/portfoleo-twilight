"use client";

import Particles, {
  ParticlesProvider,
} from "@tsparticles/react";

import { loadSlim } from "@tsparticles/slim";

interface ParticleBackgroundSettings {
  particleCount?: number;
  particleColor?: string;
  particleShadowColor?: string;

  particleLinksEnabled?: boolean;
  particleLinkColor?: string;

  backgroundColor?: string;
  moonlightColor?: string;
}

interface ParticleBackgroundProps {
  settings?: ParticleBackgroundSettings;
}

export default function ParticleBackground({
  settings,
}: ParticleBackgroundProps) {
  const init = async (engine: Parameters<typeof loadSlim>[0]) => {
    await loadSlim(engine);
  };

  const particleCount =
    settings?.particleCount ?? 300;

  const particleColor =
    settings?.particleColor ?? "#ffffff";

  const particleShadowColor =
    settings?.particleShadowColor ?? "#ffffff";

  const particleLinksEnabled =
    settings?.particleLinksEnabled ?? true;

  const particleLinkColor =
    settings?.particleLinkColor ?? "#ffffff";

  const backgroundColor =
    settings?.backgroundColor ?? "#000000";

  /*
   * Keep the original moonlight exactly as it is
   * when no system setting is provided.
   */
  const moonlight =
    settings?.moonlightColor
      ? `radial-gradient(
          circle at 75% 45%,
          ${settings.moonlightColor} 0%,
          ${settings.moonlightColor} 12%,
          ${settings.moonlightColor} 25%,
          ${settings.moonlightColor} 40%,
          ${settings.moonlightColor} 58%,
          ${settings.moonlightColor} 72%,
          ${backgroundColor} 90%
        )`
      : `radial-gradient(
          circle at 75% 45%,
          rgba(100, 135, 190, 0.9) 0%,
          rgba(75, 105, 160, 0.82) 12%,
          rgba(45, 75, 125, 0.68) 25%,
          rgba(25, 50, 95, 0.52) 40%,
          rgba(10, 22, 48, 0.38) 58%,
          rgba(3, 8, 20, 0.2) 72%,
          #000000 90%
        )`;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundColor,
      }}
    >
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
                value: particleCount,
              },

              color: {
                value: particleColor,
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

                shadow: {
                enable: true,
                color: particleShadowColor,
                blur: 5,
                offset: {
                  x: 0,
                  y: 0,
                },
              },

              links: {
                enable: particleLinksEnabled,
                distance: 150,
                color: particleLinkColor,
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
          background: moonlight,
        }}
      />
    </div>
  );
}