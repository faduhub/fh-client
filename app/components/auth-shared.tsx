export const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 11v3.6h5.1c-.2 1.3-1.5 3.9-5.1 3.9-3.1 0-5.6-2.5-5.6-5.7S8.9 7.1 12 7.1c1.8 0 2.9.7 3.6 1.4l2.5-2.4C16.5 4.6 14.5 3.7 12 3.7 6.9 3.7 2.8 7.8 2.8 13S6.9 22.3 12 22.3c5.4 0 9-3.8 9-9.1 0-.6-.1-1.1-.2-1.6H12z"
    />
  </svg>
)

export const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.4 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 3.9-1.3 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2z"
    />
  </svg>
)

export function AuthField({
  icon,
  label,
  action,
  children,
}: {
  icon: React.ReactNode
  label: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <label className="group flex flex-col gap-1.5">
      <span className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.18em] uppercase">
        {label}
      </span>
      <span className="border-border bg-secondary/40 focus-within:border-primary/60 focus-within:bg-secondary/60 flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors">
        <span className="text-muted-foreground group-focus-within:text-primary transition-colors">
          {icon}
        </span>
        {children}
        {action}
      </span>
    </label>
  )
}
