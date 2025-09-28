import * as React from 'react'
import { Modal } from '@/shared/ui/modal'
import { ErrorModalContext, type ErrorPayload } from '@/shared/context/use-error-modal'

export const ErrorModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  const [payload, setPayload] = React.useState<ErrorPayload | null>(null)
  const [node, setNode] = React.useState<React.ReactNode>(null)
  const [actionLabel, setActionLabel] = React.useState<string | undefined>(undefined)

  const hideError = React.useCallback(() => setOpen(false), [])

  const showError = React.useCallback((error: string | ErrorPayload) => {
    let next: ErrorPayload
    if (typeof error === 'string') {
      next = { title: 'Ошибка', message: error }
    } else {
      next = error
    }
    setPayload(next)
    setNode(null)
    setOpen(true)
  }, [])

  const showErrorNode = React.useCallback((n: React.ReactNode, options?: { title?: string; actionLabel?: string }) => {
    setPayload({ title: options?.title, message: '' })
    setNode(n)
    setActionLabel(options?.actionLabel)
    setOpen(true)
  }, [])

  const value = React.useMemo(() => ({ showError, showErrorNode, hideError }), [showError, showErrorNode, hideError])

  const effectiveActionLabel = actionLabel ?? 'Понятно'

  const renderBody = () => {
    if (node) {
      return <div>{node}</div>
    }
    const showMessage = Boolean(payload?.message)
    const showDescription = Boolean(payload?.description)
    return (
      <div className="space-y-2">
        {showMessage && (
          <p className="text-base text-foreground">{payload!.message}</p>
        )}
        {showDescription && (
          <p className="text-sm text-muted-foreground">{payload!.description}</p>
        )}
      </div>
    )
  }

  return (
    <ErrorModalContext.Provider value={value}>
      {children}
      <Modal
        open={open}
        title={payload?.title ?? 'Ошибка'}
        onClose={hideError}
        actionLabel={effectiveActionLabel}
        onAction={hideError}
      >
        {renderBody()}
      </Modal>
    </ErrorModalContext.Provider>
  )
}
