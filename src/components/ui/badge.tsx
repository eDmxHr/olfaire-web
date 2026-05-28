import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "text-[10px] px-3 py-1 rounded-full border tracking-wide",
        className
      )}
    >
      {children}
    </span>
  );
}
