"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Palette, GraduationCap, ShieldCheck, type LucideIcon } from "lucide-react"

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
}

const items: NavItem[] = [
  { href: "/configuracion/perfil", label: "Perfil público", icon: User },
  { href: "/configuracion/apariencia", label: "Apariencia", icon: Palette },
  { href: "/configuracion/carrera", label: "Carrera y materias", icon: GraduationCap },
  { href: "/configuracion/seguridad", label: "Seguridad", icon: ShieldCheck },
]

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
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
          </Link>
        )
      })}
    </nav>
  )
}
