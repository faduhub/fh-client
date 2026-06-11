'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Mail, Lock, User, AtSign, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'
import { AuthSuccess } from './ui/auth-success'
import { GoogleIcon, GithubIcon, AuthField } from './auth-shared'

const CARRERAS = [
  'Diseño Gráfico',
  'Diseño Industrial',
  'Diseño de Indumentaria',
  'Diseño de Imagen y Sonido',
  'Arquitectura',
  'Diseño del Paisaje',
  'Otra',
]

export function RegisterForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [showPw, setShowPw] = useState(false)
  const [name, setName] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setTimeout(() => setStatus('success'), 1300)
  }

  if (status === 'success') {
    return <AuthSuccess mode="register" name={name || 'estudiante'} />
  }

  const loading = status === 'loading'

  return (
    <div className="w-full max-w-md">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">
        USR_NEW / Registro
      </span>
      <h1 className="mt-2 text-balance font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        Creá tu cuenta
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
        >
          <GithubIcon />
          GitHub
        </button>
      </div>

      <div className="my-7 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground font-medium">
          o
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
          <AuthField icon={<AtSign className="size-4" strokeWidth={1.5} />} label="Usuario">
            <input
              type="text"
              required
              placeholder="martina-ferreyra"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
            />
          </AuthField>
        

        <AuthField icon={<Mail className="size-4" strokeWidth={1.5} />} label="Email">
          <input
            type="email"
            required
            placeholder="vos@fadu.uba.ar"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
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
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
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
              type={showPw ? 'text' : 'password'}
              required
              placeholder="••••••••"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
            />
          </AuthField>
          <p className="mt-1.5 px-1 text-xs leading-relaxed text-muted-foreground/70">
            Al menos 8 caracteres, con un número y una mayúscula.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_0_30px_-8px] shadow-primary/60 transition-all hover:shadow-primary/80 disabled:opacity-70"
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

        <p className="text-pretty text-center text-xs leading-relaxed text-muted-foreground/70">
          Al continuar aceptás los{' '}
          <a href="#" className="text-muted-foreground underline-offset-4 hover:underline">
            Términos
          </a>{' '}
          y la{' '}
          <a href="#" className="text-muted-foreground underline-offset-4 hover:underline">
            Política de privacidad
          </a>
          .
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{' '}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
        >
          Iniciá sesión
        </Link>
      </p>
    </div>
  )
}
