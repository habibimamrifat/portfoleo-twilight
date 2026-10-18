import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore Habib Rifat's full-stack projects, backend systems, APIs, and business applications.",
  alternates: {
    canonical: "/portfolio/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
