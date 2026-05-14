import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/creator/ui/utils"

const textareaVariants = cva(
  cn(
    "flex field-sizing-content w-full rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] outline-none",
    "placeholder:text-muted-foreground",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
  ),
  {
    variants: {
      size: {
        default: "min-h-16 px-3 py-2 text-base md:text-sm",
        sm: "min-h-12 px-2 py-1.5 text-xs",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type TextareaProps = Omit<React.ComponentProps<"textarea">, "size"> &
  VariantProps<typeof textareaVariants>

function Textarea({ className, size, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      data-size={size ?? "default"}
      className={cn(textareaVariants({ size }), className)}
      {...props}
    />
  )
}

export { Textarea, textareaVariants }
