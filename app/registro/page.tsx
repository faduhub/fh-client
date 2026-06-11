import type { Metadata } from "next"
import { RegisterForm } from "../components/register.form"
import { RegisterHero } from "../components/register-hero"

export const metadata: Metadata = {
  title: "FADU Reviews — Creá tu cuenta",
  description: "Registrate en FADU Reviews y compartí reseñas honestas.",
}

export default function RegistroPage() {
  return (
    <main className="bg-background relative min-h-screen lg:grid lg:grid-cols-2">
      {/* Panel de marca (oculto en mobile) */}
      <section className="border-border bg-card/40 relative hidden border-r lg:block">
        <RegisterHero />
      </section>

      {/* Panel del formulario */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
        <div
          aria-hidden="true"
          className="bg-primary/10 pointer-events-none absolute top-0 -right-32 size-[28rem] rounded-full blur-3xl lg:hidden"
        />
        <RegisterForm />
      </section>
    </main>
  )
}
