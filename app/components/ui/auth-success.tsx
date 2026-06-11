'use client'

import { useEffect, useState } from 'react'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { GradientAvatar } from './gradient-avatar'

export function AuthSuccess({
  mode,
  name,
}: {
  mode: 'login' | 'register'
  name: string
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const isRegister = mode === 'register'

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card/80 backdrop-blur-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 size-72 -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative flex flex-col items-center px-8 py-12 text-center sm:px-10">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">
          {isRegister ? 'USR_NEW / Listo' : 'USR_01 / Acceso ok'}
        </span>

        {/* check con anillo gradiente */}
        <div className="relative mt-6">
          <div
            className={`flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent transition-all duration-700 ${
              mounted ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
          >
            <div className="flex size-[5.25rem] items-center justify-center rounded-full bg-card">
              <Check
                className="size-10 text-primary"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </div>
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-primary/30 blur-2xl"
          />
        </div>

        <h1 className="mt-7 text-balance font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          {isRegister ? '¡Cuenta creada!' : '¡Hola de nuevo!'}
        </h1>
        <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
          {isRegister
            ? 'Tu perfil ya está activo. Empezá a compartir reseñas y ayudá a la comunidad de la FADU a elegir mejor.'
            : 'Ingresaste correctamente. Te llevamos a tu perfil para que sigas compartiendo.'}
        </p>

        {/* tarjeta de bienvenida con avatar */}
        <div className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-4 text-left">
          <GradientAvatar
            seed={name}
            className="size-12 shrink-0 border border-border"
          />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm text-foreground">{name}</p>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground">
              {isRegister ? 'Nuevo en la comunidad' : 'Diseño Gráfico · FADU'}
            </p>
          </div>
          {isRegister && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-primary">
              <Sparkles className="size-3" strokeWidth={2} />
              +50 XP
            </span>
          )}
        </div>

        <a
          href="/"
          className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_0_30px_-8px] shadow-primary/60 transition-all hover:shadow-primary/80"
        >
          Ir a mi perfil
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  )
}
