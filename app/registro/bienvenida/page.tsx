import type { Metadata } from "next"
import { AuthSuccess } from "@/app/components/ui/auth-success"
import { RegisterHero } from "@/app/components/register-hero"

export const metadata: Metadata = {
  title: "FADUhub — ¡Bienvenido!",
  description: "Tu cuenta fue creada con éxito.",
}

export default function BienvenidaPage({
  searchParams,
}: {
  searchParams: Promise<{ u?: string }>
}) {
  return (
    <main className="bg-background relative min-h-screen lg:grid lg:grid-cols-2">
      <section className="border-border bg-card/40 relative hidden border-r lg:block">
        <RegisterHero />
      </section>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
        <div
          aria-hidden="true"
          className="bg-primary/10 pointer-events-none absolute top-0 -right-32 size-128 rounded-full blur-3xl lg:hidden"
        />
        <BienvenidaContent searchParams={searchParams} />
      </section>
    </main>
  )
}

async function BienvenidaContent({ searchParams }: { searchParams: Promise<{ u?: string }> }) {
  const { u } = await searchParams
  return <AuthSuccess mode="register" name={u ?? "estudiante"} />
}
