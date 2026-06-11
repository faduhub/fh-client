"use client"

import { useState, type SubmitEvent } from "react"
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { GradientAvatar } from "@/app/components/ui/gradient-avatar"
import { GoogleIcon, GithubIcon, AuthField } from "@/app/components/auth-shared"
import { signIn } from "@/lib/auth-client"

export function AuthForm() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleEmailLogin(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn.email({
      email,
      password,
      callbackURL: `${window.location.origin}/`,
    })

    if (error) {
      setError(error.message || "Email o contraseña incorrectos")
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
    <div className="border-border bg-card/80 relative overflow-hidden rounded-3xl border backdrop-blur-sm">
      {/* glow superior */}
      <div
        aria-hidden="true"
        className="via-primary/60 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="bg-primary/20 pointer-events-none absolute -top-24 -right-20 size-56 rounded-full blur-3xl"
      />

      <div className="relative p-8 sm:p-10">
        {/* encabezado */}
        <div className="flex flex-col items-center text-center">
          <GradientAvatar seed={email || "fadu-reviews"} className="border-border size-16 border" />
          <h1 className="text-foreground mt-4 font-serif text-3xl font-medium tracking-tight text-balance sm:text-2xl">
            Sign in to FaduHub
          </h1>
        </div>

        {/* OAuth */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="border-border bg-secondary/50 text-foreground hover:border-primary/40 hover:bg-secondary inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition-colors"
          >
            <GoogleIcon />
            {googleLoading ? "Redirigiendo..." : "Google"}
          </button>
          <button
            type="button"
            className="border-border bg-secondary/50 text-foreground hover:border-primary/40 hover:bg-secondary inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition-colors"
          >
            <GithubIcon />
            GitHub
          </button>
        </div>

        {/* divisor */}
        <div className="my-7 flex items-center gap-4">
          <span className="bg-border h-px flex-1" />
          <span className="text-muted-foreground font-mono text-[0.65rem] font-medium tracking-[0.2em] uppercase">
            o
          </span>
          <span className="bg-border h-px flex-1" />
        </div>

        {/* formulario */}
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          <AuthField icon={<Mail className="size-4" strokeWidth={1.5} />} label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vos@fadu.uba.ar"
              autoComplete="email"
              className="text-foreground placeholder:text-muted-foreground/60 w-full bg-transparent text-sm outline-none"
            />
          </AuthField>

          <AuthField
            icon={<Lock className="size-4" strokeWidth={1.5} />}
            label="Contraseña"
            action={
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPw ? (
                  <EyeOff className="size-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="size-4" strokeWidth={1.5} />
                )}
              </button>
            }
          >
            <input
              type={showPw ? "text" : "password"}
              required
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="text-foreground placeholder:text-muted-foreground/60 w-full bg-transparent text-sm outline-none"
            />
          </AuthField>

          <div className="flex items-center justify-end text-xs">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {error && <p className="text-destructive text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="group bg-primary text-primary-foreground shadow-primary/60 hover:shadow-primary/80 mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium shadow-[0_0_30px_-8px] transition-all disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                Iniciar sesión
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* cambio de modo */}
        <p className="text-muted-foreground mt-7 text-center text-sm">
          ¿Sos nuevo?
          <button
            type="button"
            onClick={() => router.push("/registro")}
            className="text-primary font-medium underline-offset-4 transition-colors hover:underline"
          >
            Registrate
          </button>
        </p>
      </div>
    </div>
  )
}
