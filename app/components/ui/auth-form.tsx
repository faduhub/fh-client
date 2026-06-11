"use client"

import { useState, type SubmitEvent } from "react"
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react"
import { GradientAvatar } from "../ui/gradient-avatar"
// import { AuthSuccess } from './auth-success'
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 11v3.6h5.1c-.2 1.3-1.5 3.9-5.1 3.9-3.1 0-5.6-2.5-5.6-5.7S8.9 7.1 12 7.1c1.8 0 2.9.7 3.6 1.4l2.5-2.4C16.5 4.6 14.5 3.7 12 3.7 6.9 3.7 2.8 7.8 2.8 13S6.9 22.3 12 22.3c5.4 0 9-3.8 9-9.1 0-.6-.1-1.1-.2-1.6H12z"
    />
  </svg>
)

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.4 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 3.9-1.3 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2z"
    />
  </svg>
)

export function AuthForm() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleEmailLogin(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    // setError(null)
    setLoading(true)

    const { error } = await signIn.email({
      email,
      password,
      callbackURL: `${window.location.origin}/`,
    })

    if (error) {
      // setError(error.message || "Email o contraseña incorrectos")
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
          <GradientAvatar
            seed={email || name || "fadu-reviews"}
            className="border-border size-16 border"
          />
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
          <Field icon={<Mail className="size-4" strokeWidth={1.5} />} label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vos@fadu.uba.ar"
              autoComplete="email"
              className="text-foreground placeholder:text-muted-foreground/60 w-full bg-transparent text-sm outline-none"
            />
          </Field>

          <Field
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
          </Field>

          <div className="flex items-center justify-end text-xs">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => router.push("/registro")}
            className="group bg-primary text-primary-foreground shadow-primary/60 hover:shadow-primary/80 mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium shadow-[0_0_30px_-8px] transition-all disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                Crear cuenta
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

function Field({
  icon,
  label,
  action,
  children,
}: {
  icon: React.ReactNode
  label: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <label className="group flex flex-col gap-1.5">
      <span className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.18em] uppercase">
        {label}
      </span>
      <span className="border-border bg-secondary/40 focus-within:border-primary/60 focus-within:bg-secondary/60 flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors">
        <span className="text-muted-foreground group-focus-within:text-primary transition-colors">
          {icon}
        </span>
        {children}
        {action}
      </span>
    </label>
  )
}
