"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { AtSign, Check, Loader2, X } from "lucide-react"
import type { Me } from "@/lib/api/dtos/responses/me"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Toast } from "@/app/components/ui/toast"
import { useUsernameCheck } from "@/lib/hooks/use-username-check"
import { changeUsernameAction } from "@/lib/api/actions/account.actions"
import { cn } from "@/lib/utils"

const STATUS_ICON = {
  checking: <Loader2 className="text-muted-foreground size-4 animate-spin" />,
  available: <Check className="text-accent size-4" />,
  taken: <X className="text-destructive size-4" />,
  invalid: <X className="text-destructive size-4" />,
  idle: null,
} as const

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "long" })
}

export function UsernameForm({ me }: { me: Me }) {
  const router = useRouter()
  const toast = Toast.useToastManager()
  const { value, setValue, status, message } = useUsernameCheck(me.username ?? "")
  const [pending, startTransition] = useTransition()

  const locked = me.canChangeUsernameAt != null
  const canSubmit = status === "available" && !pending

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    startTransition(async () => {
      const res = await changeUsernameAction(value.trim())
      if (!res.success) {
        toast.add({ title: "No se pudo cambiar", description: res.error, type: "error" })
        return
      }
      toast.add({ title: "Username actualizado", type: "success" })
      router.refresh()
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-card flex flex-col gap-4 rounded-md border p-6"
    >
      <div>
        <h2 className="text-foreground text-base font-semibold">Username</h2>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Tu identidad pública. Se puede cambiar una vez cada 30 días.
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="relative max-w-xs">
          <AtSign className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value.toLowerCase())}
            disabled={locked}
            placeholder="tu_username"
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={status === "taken" || status === "invalid"}
            className="h-9 pr-9 pl-8"
          />
          {!locked && (
            <span className="absolute top-1/2 right-2.5 -translate-y-1/2">
              {STATUS_ICON[status]}
            </span>
          )}
        </div>
        {locked ? (
          <p className="text-muted-foreground text-xs">
            Podés cambiarlo el {formatDate(me.canChangeUsernameAt!)}.
          </p>
        ) : (
          message && (
            <p
              className={cn(
                "text-xs",
                status === "taken" || status === "invalid"
                  ? "text-destructive"
                  : status === "available"
                    ? "text-accent"
                    : "text-muted-foreground",
              )}
            >
              {message}
            </p>
          )
        )}
      </div>

      {!locked && (
        <div>
          <Button type="submit" disabled={!canSubmit} size="sm">
            {pending ? "Guardando..." : "Cambiar username"}
          </Button>
        </div>
      )}
    </form>
  )
}
