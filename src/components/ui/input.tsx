import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const isSearch = type === "search"

    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          // your existing base input classes
          "flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-foreground/60 border border-border outline-none transition",
          // add orange outline automatically for search fields
          isSearch &&
            "border-[hsl(var(--promo))] focus:border-[hsl(var(--promo))]",
          isSearch &&
            "focus-visible:ring-2 focus-visible:ring-[hsl(var(--promo))/0.35]",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
export { Input }
