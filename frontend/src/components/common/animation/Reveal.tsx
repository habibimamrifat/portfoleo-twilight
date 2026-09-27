"use client";

import { motion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 0.7,
  y = 40,
}: RevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}