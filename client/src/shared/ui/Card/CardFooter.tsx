import { cn } from "@/lib/utils"
import React from "react"
import { type CardProps } from "./Card"

export const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'
