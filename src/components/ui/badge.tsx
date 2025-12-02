import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { cn, badgeVariants } from "@/lib/utils"

// BEFORE: Standard badge styles
// AFTER: Refined badge with professional colors and spacing
// KEY CHANGES:
// - Updated variants in utils.ts (will be done next)
// - Maintained structure but ensured compatibility with new design system

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge }
