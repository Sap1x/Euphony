"use client"

import { useState, useEffect } from "react"

type ToastProps = {
  title: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

type Toast = ToastProps & {
  id: string
  visible: boolean
}

let toasts: Toast[] = []
let listeners: ((toasts: Toast[]) => void)[] = []

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...toasts]))
}

export function toast(props: ToastProps) {
  const id = Math.random().toString(36).substring(2, 9)
  const newToast: Toast = {
    ...props,
    id,
    visible: true,
    duration: props.duration || 5000,
  }

  toasts = [...toasts, newToast]
  notifyListeners()

  // Auto dismiss
  setTimeout(() => {
    dismissToast(id)
  }, newToast.duration)

  return {
    id,
    dismiss: () => dismissToast(id),
  }
}

export function dismissToast(id: string) {
  const index = toasts.findIndex((t) => t.id === id)
  if (index !== -1) {
    // Mark as invisible first (for animation)
    toasts[index].visible = false
    notifyListeners()

    // Remove after animation
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id)
      notifyListeners()
    }, 300)
  }
}

export function useToast() {
  const [localToasts, setLocalToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handleToastsChange = (newToasts: Toast[]) => {
      setLocalToasts(newToasts)
    }

    listeners.push(handleToastsChange)
    setLocalToasts([...toasts])

    return () => {
      listeners = listeners.filter((l) => l !== handleToastsChange)
    }
  }, [])

  return {
    toasts: localToasts,
    toast,
    dismiss: dismissToast,
  }
}

