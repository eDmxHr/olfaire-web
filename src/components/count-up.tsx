"use client";

import { useRef, useEffect, useState } from "react";
import { useInView, animate } from "motion/react";

interface CountUpProps {
  value: string;
  className?: string;
}

export function CountUp({ value, className }: CountUpProps) {
  const match = value.match(/^([^\d]*)([\d.]+)([^\d.]*)$/);
  const prefix = match?.[1] ?? "";
  const numStr = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const target = match ? parseFloat(numStr) : 0;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });

  useEffect(() => {
    if (!match || !isInView) return;
    const controls = animate(0, target, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => {
          const formatted = v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          setDisplay(`${prefix}${formatted}${suffix}`);
        },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
