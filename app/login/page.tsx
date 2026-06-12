import type { Metadata } from "next"
import { AuthForm } from "../components/ui/auth-form"

export const metadata: Metadata = {
  title: "FADUhub — Acceso",
  description: "Ingresá o registrate en FADUhub.",
}

export default function LoginPage() {
  return (
    <main className="bg-background relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-primary/10 pointer-events-none fixed top-0 -left-32 size-128 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-accent/10 pointer-events-none fixed -right-40 bottom-0 size-128 rounded-full blur-3xl"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-12">
        <AuthForm />
      </div>
    </main>
  )
}
