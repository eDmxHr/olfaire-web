"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";

interface PhoneParallaxProps {
  back?: { src: string; alt: string };
  front?: { src: string; alt: string };
}

export function PhoneParallax({
  back = { src: "/assets/layering.png", alt: "Olfaire app layering chemistry screen" },
  front = { src: "/assets/lumi-in-the-action.png", alt: "Lumi AI fragrance guide suggesting a daily pick from your collection" },
}: PhoneParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yBack = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const yFront = useTransform(scrollYProgress, [0, 1], [60, -20]);

  return (
    <div
      ref={ref}
      className="relative h-[580px] lg:h-[700px] w-full flex items-center justify-center"
    >
      {/* Back phone — desktop only, tilted */}
      <motion.div
        style={{ x: -64, y: yBack, rotate: -20, translateY: 20 }}
        className="absolute z-10 hidden lg:block"
      >
        <div className="phone-mockframe" style={{ width: 260 }}>
          <div className="phone-screen">
            <Image
              src={back.src}
              alt={back.alt}
              width={260}
              height={563}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </motion.div>

      {/* Front phone — desktop: tilted + offset right */}
      <motion.div
        style={{ x: 90, y: yFront, rotate: 20, translateY: -10 }}
        className="absolute z-20 hidden lg:block"
      >
        <div className="phone-mockframe" style={{ width: 260 }}>
          <div className="phone-screen">
            <Image
              src={front.src}
              alt={front.alt}
              width={260}
              height={563}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </motion.div>

      {/* Mobile: single centered phone, no tilt */}
      <motion.div style={{ y: yFront }} className="lg:hidden">
        <div className="phone-mockframe" style={{ width: 260 }}>
          <div className="phone-screen">
            <Image
              src={front.src}
              alt={front.alt}
              width={260}
              height={563}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
