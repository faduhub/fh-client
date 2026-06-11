"use client"

import { useState } from "react"
import { GradientAvatar } from "./gradient-avatar"
import { SettingsNav, type SettingsSection } from "./settings-nav"
import { ProfilePanel } from "./profile-panel"
import { AppearancePanel } from "./appearance-panel"
import { CoursesPanel } from "./courses-panels"
import { AccountPanel, NotificationsPanel, SecurityPanel } from "./misc-panels"

export function SettingsLayout() {
  const [active, setActive] = useState<SettingsSection>("profile")

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
      <aside className="flex flex-col gap-6 lg:sticky lg:top-8 lg:w-64 lg:shrink-0">
        <div className="border-border bg-card/80 flex items-center gap-3 rounded-2xl border p-4 backdrop-blur-sm">
          <GradientAvatar seed="Martina Ferreyra" className="border-border size-11 border" />
          <div className="min-w-0 leading-tight">
            <p className="text-foreground truncate text-sm font-medium">Martina Ferreyra</p>
            <p className="text-muted-foreground truncate font-mono text-[0.7rem] tracking-widest uppercase">
              @martina-ferreyra
            </p>
          </div>
        </div>
        <SettingsNav active={active} onChange={setActive} />
      </aside>

      <div className="min-w-0 flex-1">
        {active === "profile" && <ProfilePanel />}
        {active === "account" && <AccountPanel />}
        {active === "appearance" && <AppearancePanel />}
        {active === "courses" && <CoursesPanel />}
        {active === "notifications" && <NotificationsPanel />}
        {active === "security" && <SecurityPanel />}
      </div>
    </div>
  )
}
