"use client"

import { motion, useScroll, useSpring } from "motion/react"
import { useState, useEffect } from "react"

export function ScrollProgress() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[1.5px] bg-amber origin-left z-[60]"
      style={{ scaleX, opacity: scrolled ? 1 : 0 }}
    />
  )
}
