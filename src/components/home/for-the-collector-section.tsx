"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import homeImg from "@/../public/assets/home.png";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FeatureItem } from "@/components/ui/feature-item";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Heading } from "@/components/ui/heading";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animate";
import { personas } from "@/data/home";

export function ForTheCollectorSection() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: phoneRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <SectionWrapper className="bg-linen" maxWidth="lg">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <FadeUp>
          <Eyebrow className="mb-6">Who it&#39;s for</Eyebrow>
          <Heading as="h2" size="section" className="mb-8">
            Built for people who take fragrance seriously.
          </Heading>
          <StaggerChildren className="space-y-6" stagger={0.1} delay={0.2}>
            {personas.map((persona) => (
              <StaggerItem key={persona.title}>
                <FeatureItem title={persona.title}>
                  {persona.description}
                </FeatureItem>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </FadeUp>

        <div ref={phoneRef} className="flex justify-center">
          <motion.div style={{ y }}>
            <div className="phone-mockframe" style={{ width: 260 }}>
              <div className="phone-screen">
                <Image
                  src={homeImg}
                  alt="Olfaire home screen showing today's fragrance suggestion by Lumi"
                  width={260}
                  height={563}
                  sizes="260px"
                  placeholder="blur"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
