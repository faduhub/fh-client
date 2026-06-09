"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { GoogleIcon } from "@/app/components/icons/google-icon"
import { cn } from "@/lib/utils"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn.email({
      email,
      password,
      callbackURL: `${window.location.origin}/`,
    })

    if (error) {
      setError("Email o contraseña incorrectos")
      setLoading(false)
      return
    }

    router.push("/")
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    await signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/`,
    })
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        variant="outline"
        className="relative h-10 w-full gap-3 text-sm font-medium"
      >
        <GoogleIcon className="size-4 shrink-0" />
        {googleLoading ? "Redirigiendo..." : "Continuar con Google"}
      </Button>

      <div className="relative flex items-center gap-3">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">o</span>
        <div className="bg-border h-px flex-1" />
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-3">
        <Input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-10"
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-10"
        />

        {error && <p className="text-destructive text-xs">{error}</p>}

        <Button type="submit" disabled={loading} className={cn("h-10 w-full")}>
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>
    </div>
  )
}
