"use client"

import { useState, Fragment } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "@base-ui/react/menu"
import {
  HomeIcon,
  PanelLeftIcon,
  PanelRightIcon,
  SettingsIcon,
  LogOutIcon,
  UserIcon,
  ChevronRightIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "@/lib/auth-client"
import type { Me } from "@/lib/api/dtos/responses/me"

type NavChild = { label: string; href: string; children?: Omit<NavChild, "children">[] }
type NavItem = { label: string; href: string; icon: React.ElementType; children?: NavChild[] }

function StoolIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 5h12l1.5 3H4.5L6 5Z" />
      <path d="M7 8v11" />
      <path d="M17 8v11" />
      <path d="M9.5 8v10" />
      <path d="M14.5 8v10" />
      <path d="M7 19h2" />
      <path d="M15 19h2" />
      <path d="M7 14h10" />
      <path d="M8 11h8" />
    </svg>
  )
}

const navGroups: NavItem[][] = [
  [
    { label: "Inicio", href: "/", icon: HomeIcon },
    {
      label: "Explorar",
      href: "/catedras",
      icon: SearchIcon,
      children: [{ label: "Cátedras", href: "/catedras" }],
    },
    { label: "Experiencias", href: "/experiencias", icon: StarIcon },
    { label: "Mi FADU", href: "/configuracion", icon: StoolIcon },
  ],
]

const popupClass =
  "min-w-40 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md data-entering:animate-in data-entering:fade-in-50 data-entering:zoom-in-95"

const menuItemLinkClass =
  "flex w-full items-center gap-2 px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"

const menuItemTriggerClass =
  "flex w-full items-center gap-2 px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground rounded-sm cursor-default"

export function AppSidebar({ me }: { me: Me | null }) {
  const [expanded, setExpanded] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  const avatarInitial = me?.username?.[0] ?? me?.firstName?.[0] ?? "?"

  return (
    <aside
      className={cn(
        "border-border bg-sidebar sticky top-0 flex h-svh shrink-0 flex-col border-r py-4 transition-all duration-200 ease-in-out",
        expanded ? "w-56 px-3" : "w-14 px-2",
      )}
    >
      <div
        className={cn(
          "mb-6 flex items-center",
          expanded ? "justify-between px-2" : "justify-center",
        )}
      >
        {expanded && (
          <Link href="/" className="flex items-baseline gap-1.5">
            <span className="text-sidebar-foreground text-lg leading-none font-bold tracking-tight">
              faduHub
            </span>
            <span className="text-sidebar-primary font-mono text-[10px] tracking-widest uppercase">
              UBA
            </span>
          </Link>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-1.5"
          aria-label={expanded ? "Colapsar sidebar" : "Expandir sidebar"}
        >
          {expanded ? <PanelLeftIcon className="size-4" /> : <PanelRightIcon className="size-4" />}
        </button>
      </div>

      <nav className="flex-1">
        {navGroups.map((group, groupIndex) => (
          <Fragment key={groupIndex}>
            {groupIndex > 0 && <div className="bg-sidebar-border mx-2 my-2 h-px" />}
            <div className="space-y-0.5">
              {group.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                const itemClass = cn(
                  "flex items-center text-left gap-3 rounded-md py-2 text-sm font-medium transition-colors w-full",
                  expanded ? "px-3" : "justify-center px-0",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )

                if (item.children) {
                  return (
                    <Menu.Root key={item.href}>
                      <Menu.Trigger
                        className={itemClass}
                        title={!expanded ? item.label : undefined}
                        openOnHover
                      >
                        <item.icon className="size-4 shrink-0" />
                        {expanded && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            <ChevronRightIcon className="size-3 shrink-0 opacity-50" />
                          </>
                        )}
                      </Menu.Trigger>
                      <Menu.Portal>
                        <Menu.Positioner side="right" align="start" sideOffset={4}>
                          <Menu.Popup className={popupClass}>
                            {item.children.map((child) =>
                              child.children ? (
                                <Menu.SubmenuRoot key={child.href}>
                                  <Menu.SubmenuTrigger className={menuItemTriggerClass} openOnHover>
                                    <span className="flex-1">{child.label}</span>
                                    <ChevronRightIcon className="size-3 opacity-50" />
                                  </Menu.SubmenuTrigger>
                                  <Menu.Portal>
                                    <Menu.Positioner side="right" align="start" sideOffset={4}>
                                      <Menu.Popup className={popupClass}>
                                        {child.children.map((grandchild) => (
                                          <Menu.Item
                                            key={grandchild.href}
                                            className="overflow-hidden rounded-sm p-0"
                                          >
                                            <Link
                                              href={grandchild.href}
                                              className={menuItemLinkClass}
                                            >
                                              {grandchild.label}
                                            </Link>
                                          </Menu.Item>
                                        ))}
                                      </Menu.Popup>
                                    </Menu.Positioner>
                                  </Menu.Portal>
                                </Menu.SubmenuRoot>
                              ) : (
                                <Menu.Item
                                  key={child.href}
                                  className="overflow-hidden rounded-sm p-0"
                                >
                                  <Link href={child.href} className={menuItemLinkClass}>
                                    {child.label}
                                  </Link>
                                </Menu.Item>
                              ),
                            )}
                          </Menu.Popup>
                        </Menu.Positioner>
                      </Menu.Portal>
                    </Menu.Root>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={!expanded ? item.label : undefined}
                    className={itemClass}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {expanded && <span className="truncate">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </Fragment>
        ))}
      </nav>

      <div className="border-sidebar-border border-t pt-3">
        {me ? (
          <Menu.Root>
            <Menu.Trigger
              className={cn(
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-3 rounded-md py-2 text-sm font-medium",
                expanded ? "px-3" : "justify-center px-0",
              )}
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                {avatarInitial}
              </div>
              {expanded && <span className="truncate">{me.username}</span>}
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner className="z-50" side="right" align="end" sideOffset={8}>
                <Menu.Popup className={popupClass}>
                  <Menu.Item className="overflow-hidden rounded-sm p-0">
                    <Link href={`/usuario/${me.slug}`} className={menuItemLinkClass}>
                      <UserIcon className="size-3.5" />
                      Perfil
                    </Link>
                  </Menu.Item>
                  <Menu.Item className="overflow-hidden rounded-sm p-0">
                    <Link href="/configuracion" className={menuItemLinkClass}>
                      <SettingsIcon className="size-3.5" />
                      Configuración
                    </Link>
                  </Menu.Item>
                  <Menu.Separator className="bg-border my-1 h-px" />
                  <Menu.Item
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none"
                    onClick={handleSignOut}
                  >
                    <LogOutIcon className="size-3.5" />
                    Logout
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        ) : (
          <Link
            href="/login"
            className={cn(
              "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-md py-2 text-sm font-medium",
              expanded ? "px-3" : "justify-center px-0",
            )}
            title={!expanded ? "Login" : undefined}
          >
            <UserIcon className="size-4 shrink-0" />
            {expanded && <span>Login</span>}
          </Link>
        )}
      </div>
    </aside>
  )
}
