import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-2", className)}>
      <span className="text-xs font-medium uppercase tracking-accent text-ash">
        {label}
      </span>
      {children}
    </label>
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-lg border border-dust bg-white/60 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/50 focus:border-amber focus:ring-2 focus:ring-amber/20",
        className,
      )}
      {...props}
    />
  );
}
