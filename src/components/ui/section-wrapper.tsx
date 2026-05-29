import { cn } from "@/lib/utils"

const maxWidthMap = {
  sm:   "max-w-xl",
  md:   "max-w-2xl",
  lg:   "max-w-4xl",
  xl:   "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "max-w-7xl",
} as const

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  id?: string
  maxWidth?: keyof typeof maxWidthMap
}

export function SectionWrapper({
  children,
  className,
  innerClassName,
  id,
  maxWidth = "xl",
}: SectionWrapperProps) {
  return (
    <section id={id} className={cn("py-24 px-6", className)}>
      <div className={cn(maxWidthMap[maxWidth], "mx-auto", innerClassName)}>
        {children}
      </div>
    </section>
  )
}
