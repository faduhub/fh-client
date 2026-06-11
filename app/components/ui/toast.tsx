"use client"

import { Toast, type ToastObject } from "@base-ui/react/toast"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export { Toast }

function ToastList() {
  const manager = Toast.useToastManager()
  return (
    <>
      {manager.toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </>
  )
}




export function Toaster() {
  return (
    
      <Toast.Portal>
        <Toast.Viewport className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2 outline-none">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    
  )
}

export function ToastItem({ toast }: {toast: ToastObject<object>}) {
  return (
    <Toast.Root
      toast={toast}
      className={cn(
        "flex items-start justify-between gap-3 rounded-md border bg-card p-4 shadow-lg",
        "data-ending-style:translate-x-4 data-ending-style:opacity-0",
        "data-starting-style:translate-x-4 data-starting-style:opacity-0",
        "transition-all duration-200",
        toast.type === "error" && "border-destructive/40",
        toast.type === "success" && "border-accent/40",
      )}
    >
      <Toast.Content className="flex flex-col gap-0.5">
        {toast.title && (
          <Toast.Title className="text-sm font-medium text-foreground">
            {toast.title}
          </Toast.Title>
        )}
        {toast.description && (
          <Toast.Description className="text-xs text-muted-foreground">
            {toast.description}
          </Toast.Description>
        )}
      </Toast.Content>
      <Toast.Close className="shrink-0 text-muted-foreground transition-colors hover:text-foreground">
        <X className="size-3.5" />
      </Toast.Close>
    </Toast.Root>
  )
}
