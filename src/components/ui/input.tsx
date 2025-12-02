import * as React from "react"

import { cn } from "@/lib/utils"

// BEFORE: Standard input with default focus ring
// AFTER: Professional input with clean border and refined focus state
// KEY CHANGES:
// - Added transition-all for smooth focus effects
// - Refined border colors and focus ring
// - Adjusted padding for better text alignment

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border-0 bg-slate-100 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:bg-white transition-all duration-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
