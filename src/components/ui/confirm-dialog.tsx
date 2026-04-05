"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"
import { GlowButton } from "./glow-button"

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "default"
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  // Keyboard accessibility
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onCancel])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 z-[95] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-desc"
          >
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-start gap-3 mb-4">
                {variant === "danger" && (
                  <div className="p-2 bg-red-400/10 rounded-lg border border-red-400/20 shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                )}
                <div>
                  <h3 id="confirm-title" className="text-base font-bold text-white">{title}</h3>
                  <p id="confirm-desc" className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
                <button onClick={onCancel} className="ml-auto text-muted-foreground hover:text-white" aria-label="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <GlowButton variant="outline" onClick={onCancel} disabled={isLoading}>
                  {cancelLabel}
                </GlowButton>
                <GlowButton
                  onClick={onConfirm}
                  disabled={isLoading}
                  variant={variant === "danger" ? "destructive" : "primary"}
                >
                  {isLoading ? "Processing..." : confirmLabel}
                </GlowButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
