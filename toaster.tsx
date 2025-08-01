"use client"
import { X } from "lucide-react"
import { useToast } from "./use-toast"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-0 right-0 z-50 p-4 flex flex-col items-end gap-2 max-w-md w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "bg-[#193552] border border-[#1e3a5f] text-white rounded-lg shadow-lg p-4 w-full transform transition-all duration-300 ease-in-out",
            toast.visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
            toast.variant === "destructive" && "border-red-500",
          )}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && <p className="text-sm text-gray-400 mt-1">{toast.description}</p>}
            </div>
            <button onClick={() => dismiss(toast.id)} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

