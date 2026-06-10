"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { AtSign, Check, Loader2, X } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { useUsernameCheck } from "@/lib/hooks/use-username-check"
import { changeUsernameAction, dismissOnboardingAction } from "@/lib/api/actions/account.actions"
import { cn } from "@/lib/utils"

const STATUS_ICON = {
  checking: <Loader2 className="text-muted-foreground size-4 animate-spin" />,
  available: <Check className="text-accent size-4" />,
  taken: <X className="text-destructive size-4" />,
  invalid: <X className="text-destructive size-4" />,
  idle: null,
} as const

export function OnboardingForm() {
  const router = useRouter()
  const { value, setValue, status, message } = useUsernameCheck()
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const canSubmit = status === "available" && !pending

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    startTransition(async () => {
      const res = await changeUsernameAction(value.trim())
      if (!res.success) {
        setError(res.error)
        return
      }
      router.push("/")
      router.refresh()
    })
  }

  function handleSkip() {
    startTransition(async () => {
      await dismissOnboardingAction()
      router.push("/")
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <div className="relative">
          <AtSign className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value.toLowerCase())
              setError(null)
            }}
            placeholder="tu_username"
            autoFocus
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={status === "taken" || status === "invalid"}
            className="h-10 pr-9 pl-8"
          />
          <span className="absolute top-1/2 right-2.5 -translate-y-1/2">
            {STATUS_ICON[status]}
          </span>
        </div>
        {(message || error) && (
          <p
            className={cn(
              "text-xs",
              error || status === "taken" || status === "invalid"
                ? "text-destructive"
                : status === "available"
                  ? "text-accent"
                  : "text-muted-foreground",
            )}
          >
            {error ?? message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={!canSubmit} className="h-10 w-full">
        {pending ? "Guardando..." : "Continuar"}
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={handleSkip}
        disabled={pending}
        className="text-muted-foreground h-9 w-full text-sm font-normal"
      >
        Por ahora no
      </Button>
    </form>
  )
}
