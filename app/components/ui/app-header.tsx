"use-client"

export default function AppHeader({ title }: { title: string }) {
  return (
    <div>
      <span className="text-primary font-mono text-[0.7rem] tracking-[0.2em] uppercase">
        FADU / UBA
      </span>
      <h1 className="text-foreground mt-1 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
        {title}
      </h1>
      <div className="from-primary/60 via-border mt-5 h-px w-full bg-linear-to-r to-transparent" />
    </div>
  )
}
