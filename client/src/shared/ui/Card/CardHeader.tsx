import { cn } from "@/shared/lib/utils";
import React from "react";
import { type CardProps } from "./Card";

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'
