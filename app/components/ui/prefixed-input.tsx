import type { ReactNode } from "react"

export function PrefixedInput({
  prefix,
  ...props
}: { prefix: ReactNode | HTMLElement } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <span className="border-border bg-secondary/40 focus-within:border-primary/60 focus-within:bg-secondary/60 flex items-center gap-2.5 rounded-xl border px-4 py-3 transition-colors">
      <span className="text-muted-foreground shrink-0">{prefix}</span>
      <input
        {...props}
        className="text-foreground placeholder:text-muted-foreground/60 w-full bg-transparent text-sm outline-none"
      />
    </span>
  )
}
