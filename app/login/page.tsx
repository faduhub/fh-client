import type { Metadata } from 'next'
import { AuthForm } from '../components/ui/auth-form'

export const metadata: Metadata = {
  title: 'FADU Reviews — Acceso',
  description: 'Ingresá o registrate en FADU Reviews.',
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-32 top-0 size-128 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -right-40 bottom-0 size-128 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-12">
        <AuthForm />
      </div>
    </main>
  )
}
