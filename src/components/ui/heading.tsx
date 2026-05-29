import { cn } from "@/lib/utils"

interface HeadingProps {
  as?: "h1" | "h2" | "h3"
  size?: "page" | "section" | "card"
  children: React.ReactNode
  className?: string
}

export function Heading({
  as: Tag = "h2",
  size = "section",
  children,
  className,
}: HeadingProps) {
  return (
    <Tag
      className={cn(
        "serif font-light leading-[1.1] tracking-[0.02em] text-ink",
        size === "page"    && "text-5xl md:text-6xl",
        size === "section" && "text-4xl md:text-5xl",
        size === "card"    && "text-2xl",
        className
      )}
    >
      {children}
    </Tag>
  )
}
