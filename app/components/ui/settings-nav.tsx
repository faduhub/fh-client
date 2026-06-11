"use client"

import {
  User,
  Settings,
  Palette,
  GraduationCap,
  Bell,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

export type SettingsSection =
  | "profile"
  | "account"
  | "appearance"
  | "courses"
  | "notifications"
  | "security"

type NavItem = {
  id: SettingsSection
  label: string
  icon: LucideIcon
}

const items: NavItem[] = [
  { id: "profile", label: "Perfil público", icon: User },
  { id: "account", label: "Cuenta", icon: Settings },
  { id: "appearance", label: "Apariencia", icon: Palette },
  { id: "courses", label: "Carrera y materias", icon: GraduationCap },
  { id: "notifications", label: "Notificaciones", icon: Bell },
  { id: "security", label: "Seguridad", icon: ShieldCheck },
]

export function SettingsNav({
  active,
  onChange,
}: {
  active: SettingsSection
  onChange: (s: SettingsSection) => void
}) {
  return (
    <nav className="flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">
      {items.map((item) => {
        const isActive = item.id === active
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-current={isActive ? "page" : undefined}
            className={`group relative inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
              isActive
                ? "bg-secondary/70 text-foreground"
                : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
            }`}
          >
            <span
              aria-hidden="true"
              className={`bg-primary absolute top-1/2 left-0 hidden h-5 w-0.5 -translate-y-1/2 rounded-full transition-opacity lg:block ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
            <item.icon
              className={`size-4 shrink-0 ${isActive ? "text-primary" : ""}`}
              strokeWidth={1.5}
            />
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
