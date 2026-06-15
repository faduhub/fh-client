"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs } from "@base-ui/react/tabs"

const tabs = [
  { href: "/mi-fadu/resumen", label: "Resumen" },
  { href: "/mi-fadu/cursadas", label: "Cursadas" },
  { href: "/mi-fadu/experiencias", label: "Experiencias" },
  { href: "/mi-fadu/guardados", label: "Guardados" },
]

export function MiFaduTabs() {
  const pathname = usePathname()

  return (
    <Tabs.Root value={pathname}>
      <Tabs.List className="border-border relative flex gap-6 overflow-x-auto border-b">
        {tabs.map((tab) => (
          <Tabs.Tab
            key={tab.href}
            value={tab.href}
            nativeButton={false}
            render={<Link href={tab.href} />}
            className="text-muted-foreground hover:text-foreground data-selected:text-foreground relative shrink-0 px-1 py-3 font-mono text-xs tracking-widest uppercase transition-colors outline-none"
          >
            {tab.label}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator
          className="bg-primary absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-200 ease-out"
          style={{
            width: "var(--active-tab-width)",
            transform: "translateX(var(--active-tab-left))",
          }}
        />
      </Tabs.List>
    </Tabs.Root>
  )
}
