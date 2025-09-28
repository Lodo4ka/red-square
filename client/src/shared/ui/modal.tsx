import * as React from 'react'
import { createPortal } from 'react-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Button } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

export type ModalProps = {
  open: boolean
  title?: string
  description?: string
  onClose: () => void
  actionLabel?: string
  onAction?: () => void
  closeOnOverlay?: boolean
  className?: string
  children?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  description,
  onClose,
  actionLabel = 'Ок',
  onAction,
  closeOnOverlay = true,
  className,
  children,
}) => {
  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  React.useEffect(() => {
    if (!open) return
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, handleKeyDown])

  if (!open) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/60 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => {
          if (closeOnOverlay) onClose()
        }}
      />
      <Card className={cn('relative z-10 w-[min(92vw,520px)]', className)} onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </CardHeader>
        {children ? <CardContent>{children}</CardContent> : null}
        <CardFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Закрыть</Button>
          {onAction ? (
            <Button variant="destructive" onClick={onAction}>{actionLabel}</Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>,
    document.body
  )
}


