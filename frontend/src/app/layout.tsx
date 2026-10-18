import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ParticleBackground from "@/components/backgrounds/ParticleBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://habibrifat.com"),

  title: {
    default: "Habib Rifat | Full-Stack Developer",
    template: "%s | Habib Rifat",
  },

  description:
    "Habib Rifat is a full-stack developer focused on backend engineering, reliable APIs, scalable web applications, and modern web experiences.",

  applicationName: "Habib Rifat Portfolio",

  openGraph: {
    type: "website",
    title: "Habib Rifat | Full-Stack Developer",
    description:
      "Explore Habib Rifat's projects, development experience, backend engineering, and full-stack web development services.",
    siteName: "Habib Rifat Portfolio",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Habib Rifat | Full-Stack Developer",
    description:
      "Explore projects, experience, and full-stack web development services by Habib Rifat.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="relative min-h-screen overflow-x-hidden">
        {/* Global background */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <ParticleBackground />
        </div>

        {/* Page content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
