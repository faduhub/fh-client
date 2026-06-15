"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import AppMenu from "./ui/menu"
import { Avatar, AvatarFallback } from "./ui/avatar"
import type { Me } from "@/lib/api/dtos/responses/me"

export function SiteHeader({ me }: { me: Me | null }) {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  const avatarInitial = me?.username?.[0] ?? me?.firstName?.[0] ?? "?"

  return (
    <header className="border-border border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <nav className="text-muted-foreground hidden w-full items-center gap-6 text-sm sm:flex sm:justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-foreground text-2xl leading-none font-bold tracking-tight">
              faduHub
            </span>
            <span className="text-accent font-mono text-xs tracking-widest uppercase">UBA</span>
          </Link>
          <div className="flex gap-x-5">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/catedras" className="hover:text-foreground transition-colors">
              Cátedras
            </Link>
          </div>

          {me ? (
            <div className="flex items-center gap-x-5">
              <Link
                href="/nueva-resena"
                className="bg-foreground text-background rounded-full px-4 py-1.5 transition-opacity hover:opacity-90"
              >
                Nueva experiencia
              </Link>
              <AppMenu
                trigger={
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
                      {avatarInitial}
                    </AvatarFallback>
                  </Avatar>
                }
                options={[
                  { label: "Perfil", onClick: () => router.push("/usuario/" + me.slug) },
                  { label: "Configuración", onClick: () => router.push("/configuracion/perfil") },
                  { label: "Logout", onClick: handleSignOut, separator: true },
                ]}
              />
            </div>
          ) : (
            <div className="flex items-center gap-x-5">
              <Link href="/login" className="hover:text-foreground transition-colors">
                Login
              </Link>
              <Link
                href="/registro"
                className="bg-foreground text-background rounded-full px-4 py-1.5 transition-opacity hover:opacity-90"
              >
                Sign in
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
