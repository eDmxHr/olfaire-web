import { cn } from "@/lib/utils";

export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-3 rounded-full bg-dust/70 motion-safe:animate-pulse",
        className,
      )}
    />
  );
}

export function SkeletonPill({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-6 rounded-full border border-dust bg-white/50 motion-safe:animate-pulse",
        className,
      )}
    />
  );
}

export function SkeletonDraftRows({ rows = 4 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="grid gap-4 border-b border-dust py-5 last:border-b-0 md:grid-cols-[1fr_auto] md:items-center"
        >
          <div>
            <div className="mb-3 flex items-center gap-2">
              <SkeletonPill className="w-16" />
              <SkeletonLine className="h-2 w-24" />
            </div>
            <SkeletonLine className="mb-3 h-4 w-2/3 max-w-md" />
            <SkeletonLine className="w-40" />
          </div>
          <div className="flex gap-2">
            <SkeletonPill className="w-14" />
            <SkeletonPill className="w-16" />
          </div>
        </div>
      ))}
    </>
  );
}

export function SkeletonOpportunityRows({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="border-t border-dust py-4 first:border-t-0 first:pt-0 last:pb-0"
        >
          <div className="mb-3 flex items-center gap-2">
            <SkeletonPill className="w-20" />
            <SkeletonLine className="h-2 w-36" />
          </div>
          <SkeletonLine className="mb-3 h-4 w-3/4" />
          <SkeletonLine className="w-full" />
          <SkeletonLine className="mt-2 w-2/3" />
        </div>
      ))}
    </div>
  );
}
