import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-full border border-dust bg-white/60 px-5 py-3.5 text-sm text-ink transition-colors outline-none placeholder:text-ink/60 focus-visible:border-amber focus-visible:ring-2 focus-visible:ring-amber/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red aria-invalid:ring-2 aria-invalid:ring-red/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
