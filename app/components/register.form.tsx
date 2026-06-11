"use client"

import { useState, SubmitEvent } from "react"
import Link from "next/link"
import { Mail, Lock, AtSign, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react"
// import { AuthSuccess } from './ui/auth-success'
import { GoogleIcon, GithubIcon, AuthField } from "./auth-shared"
import { useRouter } from "next/navigation"
import { signIn, signUp } from "@/lib/auth-client"

export function RegisterForm() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [password, setPassword] = useState("")

  async function handleRegister(e: SubmitEvent<HTMLFormElement>) {
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

    // return <AuthSuccess mode="register" name={name || 'estudiante'} />

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
    <div className="w-full max-w-md">
      <h1 className="text-foreground mt-2 font-serif text-3xl font-medium tracking-tight text-balance sm:text-4xl">
        Creá tu cuenta
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <button
          type="button"
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

      <div className="my-7 flex items-center gap-4">
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground font-mono text-[0.65rem] font-medium tracking-[0.2em] uppercase">
          o
        </span>
        <span className="bg-border h-px flex-1" />
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <AuthField icon={<AtSign className="size-4" strokeWidth={1.5} />} label="Usuario">
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
            placeholder="martina-ferreyra"
            autoComplete="name"
            className="text-foreground placeholder:text-muted-foreground/60 w-full bg-transparent text-sm outline-none"
          />
        </AuthField>

        <AuthField icon={<Mail className="size-4" strokeWidth={1.5} />} label="Email">
          <input
            type="email"
            required
            placeholder="tu@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-foreground placeholder:text-muted-foreground/60 w-full bg-transparent text-sm outline-none"
          />
        </AuthField>

        <div>
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
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="text-foreground placeholder:text-muted-foreground/60 w-full bg-transparent text-sm outline-none"
            />
          </AuthField>
          <p className="text-muted-foreground/70 mt-1.5 px-1 text-xs leading-relaxed">
            Al menos 8 caracteres, con un número y una mayúscula.
          </p>
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
              Creando cuenta...
            </>
          ) : (
            <>
              Crear cuenta
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        <p className="text-muted-foreground/70 text-center text-xs leading-relaxed text-pretty">
          Al continuar aceptás los{" "}
          <a href="#" className="text-muted-foreground underline-offset-4 hover:underline">
            Términos
          </a>{" "}
          y la{" "}
          <a href="#" className="text-muted-foreground underline-offset-4 hover:underline">
            Política de privacidad
          </a>
          .
        </p>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        ¿Ya tenés cuenta?{" "}
        <Link
          href="/login"
          className="text-primary font-medium underline-offset-4 transition-colors hover:underline"
        >
          Iniciá sesión
        </Link>
      </p>
    </div>
  )
}
