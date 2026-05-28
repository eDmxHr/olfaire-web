import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: React.ReactNode;
  variant?: "amber" | "ash" | "dark";
  className?: string;
}

const variants = {
  amber: "border-amber/30 text-amber",
  ash:   "border-dust text-ash",
  dark:  "border-parchment/20 text-parchment/50",
};

export function Eyebrow({ children, variant = "amber", className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center rounded-full border px-3 py-1",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
