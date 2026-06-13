"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const tabs = [
  { value: "muro", label: "Muro" },
  { value: "experiencias", label: "Experiencias" },
] as const

export function CatedraTabs({ active }: { active: "muro" | "experiencias" }) {
  const pathname = usePathname()
  const sp = useSearchParams()

  function href(tab: string) {
    const next = new URLSearchParams(sp.toString())
    next.set("tab", tab)
    return `${pathname}?${next}`
  }

  return (
    <div className="border-border bg-muted/40 inline-flex w-max gap-0.5 rounded-xl border p-1">
      {tabs.map((t) => (
        <Link
          key={t.value}
          href={href(t.value)}
          className={cn(
            "rounded-lg px-5 py-2 text-sm font-medium transition-all duration-150",
            active === t.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </Link>
      ))}
    </div>
  )
}
