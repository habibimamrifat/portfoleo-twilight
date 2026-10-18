import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Experience",
  description:
    "Explore Habib Rifat's professional experience in full-stack development, backend engineering, API integration, and building web applications.",
  alternates: {
    canonical: "/portfolio/experience",
  },
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
