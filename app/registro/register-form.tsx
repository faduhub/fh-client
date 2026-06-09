"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, signUp } from "@/lib/auth-client"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { GoogleIcon } from "@/app/components/icons/google-icon"
import { cn } from "@/lib/utils"

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signUp.email({
      name,
      email,
      password,
      callbackURL: `${window.location.origin}/`,
    })

    if (error) {
      setError(
        error.code === "USER_ALREADY_EXISTS"
          ? "Ya existe una cuenta con ese email"
          : "Ocurrió un error al registrarte",
      )
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

      <form onSubmit={handleRegister} className="space-y-3">
        <Input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-10"
        />
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
          placeholder="Contraseña (mín. 8 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="h-10"
        />

        {error && <p className="text-destructive text-xs">{error}</p>}

        <Button type="submit" disabled={loading} className={cn("h-10 w-full")}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
    </div>
  )
}
