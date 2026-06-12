import { ArrowLeft } from "lucide-react"

export function ProfileHeader() {
  return (
    <header className="flex items-center justify-between">
      <a
        href="#"
        className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase transition-colors"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        Volver a experiencias
      </a>

      <span className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">
        FADU<span className="text-primary"> / </span>REVIEWS
      </span>
    </header>
  )
}
