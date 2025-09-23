import * as React from 'react'
import { Spinner } from '@/shared/ui/spinner'
import { cn } from '@/shared/lib/utils'

export interface PageLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

export const PageLoader: React.FC<PageLoaderProps> = ({ label = 'Загрузка…', className, ...props }) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 grid place-items-center bg-background/60 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 rounded-md border bg-card px-4 py-3 shadow-sm">
        <Spinner size="lg" />
        <span className="text-sm text-foreground">{label}</span>
      </div>
    </div>
  )
}


