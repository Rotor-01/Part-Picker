import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

import { cn, buttonVariants } from "@/lib/utils"

// BEFORE: Standard shadcn/ui button styles
// AFTER: Professional, IdeaRocket-inspired button styles with refined hover states and shadows
// KEY CHANGES:
// - Updated primary variant to use new blue color with subtle shadow
// - Refined secondary and outline variants for better contrast
// - Added transition-all for smooth hover effects
// - Adjusted padding and radius for a more modern look

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
