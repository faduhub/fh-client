import type { Metadata } from 'next'
import { RegisterForm } from '../components/register.form'
import { RegisterHero } from '../components/register-hero'

export const metadata: Metadata = {
  title: 'FADU Reviews — Creá tu cuenta',
  description: 'Registrate en FADU Reviews y compartí reseñas honestas.',
}

export default function RegistroPage() {
  return (
    <main className="relative min-h-screen bg-background lg:grid lg:grid-cols-2">
      {/* Panel de marca (oculto en mobile) */}
      <section className="relative hidden border-r border-border bg-card/40 lg:block">
        <RegisterHero />
      </section>

      {/* Panel del formulario */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-0 size-[28rem] rounded-full bg-primary/10 blur-3xl lg:hidden"
        />
        <RegisterForm />
      </section>
    </main>
  )
}
