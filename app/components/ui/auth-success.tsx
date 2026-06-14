"use client"

import { useEffect, useState } from "react"
import { Check, ArrowRight, Mail } from "lucide-react"
import { GradientAvatar } from "./gradient-avatar"
import Link from "next/link"

export function AuthSuccess({ mode, name }: { mode: "login" | "register"; name: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const isRegister = mode === "register"

  return (
    <div className="border-border bg-card/80 relative overflow-hidden rounded-3xl border backdrop-blur-sm">
      <div
        aria-hidden="true"
        className="via-primary/60 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="bg-primary/20 pointer-events-none absolute top-0 left-1/2 size-72 -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
      />

      <div className="relative flex flex-col items-center px-8 py-12 text-center sm:px-10">
        <span className="text-primary font-mono text-[0.7rem] tracking-[0.2em] uppercase">
          {isRegister ? "USR_NEW / Listo" : "USR_01 / Acceso ok"}
        </span>

        {/* check con anillo gradiente */}
        <div className="relative mt-6">
          <div
            className={`from-primary to-accent flex size-24 items-center justify-center rounded-full bg-linear-to-br transition-all duration-700 ${
              mounted ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          >
            <div className="bg-card flex size-21 items-center justify-center rounded-full">
              <Check className="text-primary size-10" strokeWidth={2.5} aria-hidden="true" />
            </div>
          </div>
          <span
            aria-hidden="true"
            className="bg-primary/30 pointer-events-none absolute inset-0 rounded-full blur-2xl"
          />
        </div>

        <h1 className="text-foreground mt-7 font-serif text-3xl font-medium tracking-tight text-balance sm:text-4xl">
          {isRegister ? "¡Ya casi!" : "¡Hola de nuevo!"}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed text-pretty">
          {isRegister
            ? "Te mandamos un email de verificación. Revisá tu casilla y hacé click en el enlace para activar tu cuenta."
            : "Ingresaste correctamente. Te llevamos a tu perfil para que sigas compartiendo."}
        </p>

        {/* tarjeta de bienvenida con avatar */}
        <div className="border-border bg-secondary/40 mt-8 flex w-full items-center gap-3 rounded-2xl border p-4 text-left">
          <GradientAvatar seed={name} className="border-border size-12 shrink-0 border" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-foreground truncate text-sm">{name}</p>
            <p className="text-muted-foreground font-mono text-[0.7rem] tracking-widest uppercase">
              {isRegister ? "Verificación pendiente" : "Diseño Gráfico · FADU"}
            </p>
          </div>
          {isRegister && (
            <span className="border-primary/40 bg-primary/10 text-primary inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase">
              <Mail className="size-3" strokeWidth={2} />
              Email
            </span>
          )}
        </div>

        <Link
          href={isRegister ? "/login" : "/"}
          className="group bg-primary text-primary-foreground shadow-primary/60 hover:shadow-primary/80 mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium shadow-[0_0_30px_-8px] transition-all"
        >
          {isRegister ? "Ir al login" : "Ir a mi perfil"}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
