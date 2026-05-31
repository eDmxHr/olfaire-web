"use client";

import { motion } from "motion/react";
import { LumiMark } from "@/components/lumi-mark";

const EASE = [0.25, 0, 0, 1] as const;

interface HeroMotionProps {
  children: React.ReactNode;
}

export function HeroMotion({ children }: HeroMotionProps) {
  return (
    <>
      <motion.div
        className="flex justify-center lg:justify-start mb-8 animate-float"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <LumiMark size={64} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
      >
        {children}
      </motion.div>
    </>
  );
}
