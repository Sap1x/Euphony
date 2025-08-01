"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import LoginForm from "./login-form"
import { isLoggedIn } from "@/lib/spotify-api"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(isLoggedIn())
  }, [open])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    onOpenChange(false)
  }

  return (
    <Dialog open={open && !isAuthenticated} onOpenChange={onOpenChange}>
      <DialogContent className="bg-transparent border-none shadow-none max-w-md p-0">
        <LoginForm onSuccess={handleLoginSuccess} />
      </DialogContent>
    </Dialog>
  )
}

