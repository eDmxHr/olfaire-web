import { cn } from "@/lib/utils"

const maxWidthMap = {
  sm:   "max-w-xl",
  md:   "max-w-2xl",
  lg:   "max-w-3xl",
  xl:   "max-w-5xl",
  "2xl": "max-w-7xl",
  full: "max-w-7xl",
} as const

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  maxWidth?: keyof typeof maxWidthMap
}

export function PageWrapper({
  children,
  className,
  innerClassName,
  maxWidth = "md",
}: PageWrapperProps) {
  return (
    <div className={cn("pt-32 pb-24 px-6 max-w-7xl mx-auto", className)}>
      <div className={cn(maxWidthMap[maxWidth], "mx-auto", innerClassName)}>
        {children}
      </div>
    </div>
  )
}
