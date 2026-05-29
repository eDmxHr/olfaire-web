"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";

export function PhoneParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <div ref={ref} className="flex justify-center items-center">
      <motion.div style={{ y }} className="phone-mockframe w-[300px]">
        <div className="phone-screen bg-ink overflow-hidden relative">
          <Image
            src="/assets/home.png"
            alt="Olfaire app"
            fill
            className="object-cover object-top"
          />
        </div>
      </motion.div>
    </div>
  );
}
