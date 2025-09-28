import * as React from 'react'

export type ErrorPayload = {
  title?: string
  message: string
  description?: string
}

export type ErrorModalContextValue = {
  showError: (error: string | ErrorPayload) => void
  showErrorNode: (node: React.ReactNode, options?: { title?: string; actionLabel?: string }) => void
  hideError: () => void
}

export const ErrorModalContext = React.createContext<ErrorModalContextValue | undefined>(undefined)

export function useErrorModal(): ErrorModalContextValue {
  const ctx = React.useContext(ErrorModalContext)
  if (!ctx) {
    throw new Error('useErrorModal must be used within ErrorModalProvider')
  }
  return ctx
}


