import type { ReactNode } from "react"

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="border-border bg-card/80 overflow-hidden rounded-2xl border backdrop-blur-sm">
      <div className="border-border border-b px-6 py-5">
        <h2 className="text-foreground font-serif text-xl font-medium tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-6 p-6">{children}</div>
    </section>
  )
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.18em] uppercase">
      {children}
    </span>
  )
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      {children}
      {hint && <span className="text-muted-foreground/70 text-xs leading-relaxed">{hint}</span>}
    </label>
  )
}

const baseInput =
  "w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60 focus:bg-secondary/60"

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={baseInput} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${baseInput} min-h-28 resize-y`} />
}

export function SelectInput({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${baseInput} [&>option]:bg-card [&>option]:text-foreground appearance-none`}
    >
      {children}
    </select>
  )
}

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
