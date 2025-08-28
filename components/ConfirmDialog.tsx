// components/ConfirmDialog.tsx

"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  loading?: boolean
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "Are you sure you want to proceed with this action?",
  confirmText = "Yes, Continue",
  cancelText = "Cancel",
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
              {cancelText}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
              disabled={loading}
            >
              {loading ? "Processing..." : confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
