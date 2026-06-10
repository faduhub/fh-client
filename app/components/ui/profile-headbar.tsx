import { ArrowLeft } from 'lucide-react'

export function ProfileHeader() {
  return (
    <header className="flex items-center justify-between">
      <a
        href="#"
        className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        Volver a reseñas
      </a>

      <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        FADU<span className="text-primary"> / </span>REVIEWS
      </span>
    </header>
  )
}
