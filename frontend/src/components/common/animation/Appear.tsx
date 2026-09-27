"use client";

import React from "react";
import { motion } from "motion/react";

interface AppearProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "left" | "right" | "top" | "bottom" | "none";
  once?: boolean;
  immediate?: boolean;
}

export default function Appear({
  children,
  delay = 0.3,
  duration = 0.8,
  direction = "top",
  once = true,
  immediate = false,
}: AppearProps) {
  const offset = 100;

  const initialPosition = {
    left: { x: -offset, y: 0 },
    right: { x: offset, y: 0 },
    top: { x: 0, y: -offset },
    bottom: { x: 0, y: offset },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...initialPosition[direction],
      }}
      {...(immediate
        ? {
            animate: {
              opacity: 1,
              x: 0,
              y: 0,
            },
          }
        : {
            whileInView: {
              opacity: 1,
              x: 0,
              y: 0,
            },
            viewport: {
              once,
              amount: 0.4,
            },
          })}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}