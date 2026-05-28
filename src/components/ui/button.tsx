import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding font-medium whitespace-nowrap tracking-wide transition-colors duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:     "bg-ink text-parchment hover:bg-amber",
        amber:       "bg-amber text-parchment hover:bg-ink",
        outline:     "border-dust bg-transparent text-ink hover:border-ink",
        secondary:   "bg-linen text-ink hover:bg-dust",
        ghost:       "bg-transparent text-ash hover:text-ink hover:bg-linen",
        destructive: "bg-red/10 text-red hover:bg-red/20",
        link:        "text-amber underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-1.5 px-5 py-2.5 text-sm",
        sm:      "h-8 gap-1 px-4 py-2 text-xs",
        lg:      "h-12 gap-2 px-8 py-3.5 text-sm",
        icon:    "size-10 [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
