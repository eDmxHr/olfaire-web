"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

const EASE = [0.25, 0, 0, 1] as const

interface FadeUpProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  once?: boolean
}

export function FadeUp({
  children,
  className,
  delay = 0,
  duration = 0.6,
  y = 20,
  once = true,
}: FadeUpProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-40px" }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerChildrenProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
  once?: boolean
}

export function StaggerChildren({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  once = true,
}: StaggerChildrenProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
  y?: number
  duration?: number
}

export function StaggerItem({
  children,
  className,
  y = 20,
  duration = 0.55,
}: StaggerItemProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden:  { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}
