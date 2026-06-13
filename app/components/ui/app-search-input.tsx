import { Search } from "lucide-react"

export function AppSearchInput({ placeholder }: { placeholder?: string }) {
  return (
    <div className="border-border bg-card/60 relative flex items-center gap-3 rounded-2xl border px-4 py-4 backdrop-blur-sm">
      <Search className="text-muted-foreground size-5 shrink-0" />
      <input
        type="search"
        placeholder={placeholder ?? "Buscar materia, cátedra, carrera o cursada..."}
        className="text-foreground placeholder:text-muted-foreground/50 w-full bg-transparent text-base outline-none"
      />
    </div>
  )
}
