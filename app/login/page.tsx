import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth-form'

export const metadata: Metadata = {
  title: 'FADU Reviews — Acceso',
  description: 'Ingresá o registrate en FADU Reviews.',
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* glows de fondo, mismo lenguaje que el perfil */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-32 top-0 size-[32rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -right-40 bottom-0 size-[34rem] rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-12">
        {/* logo */}
        <div className="mb-8 flex items-center justify-center">
          <span className="font-mono text-sm uppercase tracking-[0.18em] text-muted-foreground">
            FADU<span className="text-primary"> / </span>REVIEWS
          </span>
        </div>

        <AuthForm />

        <p className="mt-8 text-center font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground/60">
          Reseñas honestas · FADU · UBA
        </p>
      </div>
    </main>
  )
}
