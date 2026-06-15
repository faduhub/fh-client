import { GradientAvatar } from "@/app/components/ui/gradient-avatar"
import { Me } from "@/lib/api/dtos/responses/me"
import { Menu } from "@base-ui/react/menu"
import { ChevronsUpDown, Check, Settings2 } from "lucide-react"

type EnrolledDegree = Me["degrees"][number]

type DegreeSidebarProps = {
  activeDegree: EnrolledDegree | null
  enrolledDegrees: EnrolledDegree[]
  username?: string | null
  onActiveDegreeChange: (id: number) => void
  onManageDegrees: () => void
}

const eyebrowClass = "text-muted-foreground font-mono text-[0.7rem] tracking-widest uppercase"

const popupClass =
  "min-w-[var(--anchor-width)] overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-md data-entering:animate-in data-entering:fade-in-50 data-entering:zoom-in-95"
const menuItemClass =
  "flex w-full cursor-default items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"

export function DegreeSidebar({
  activeDegree,
  enrolledDegrees,
  username,
  onActiveDegreeChange,
  onManageDegrees,
}: DegreeSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-8 lg:w-64 lg:shrink-0">
      <Menu.Root>
        <Menu.Trigger className="border-border bg-card/80 hover:bg-secondary/40 flex w-full items-center gap-3 rounded-2xl border p-4 text-left backdrop-blur-sm transition-colors">
          <GradientAvatar
            seed={activeDegree?.name ?? "?"}
            className="border-border size-11 shrink-0 border"
          />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-foreground truncate text-sm font-medium">{activeDegree?.name}</p>
            {username && <p className={`truncate ${eyebrowClass}`}>@{username}</p>}
          </div>
          <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner side="bottom" align="start" sideOffset={6} className="z-50">
            <Menu.Popup className={popupClass}>
              {enrolledDegrees.map((degree) => (
                <Menu.Item
                  key={degree.id}
                  className={menuItemClass}
                  onClick={() => onActiveDegreeChange(degree.id)}
                >
                  <Check
                    className={`size-3.5 shrink-0 ${degree.id === activeDegree?.id ? "opacity-100" : "opacity-0"}`}
                  />
                  <span className="min-w-0 flex-1 truncate">{degree.name}</span>
                </Menu.Item>
              ))}
              <Menu.Separator className="bg-border my-1 h-px" />
              <Menu.Item className={menuItemClass} onClick={onManageDegrees}>
                <Settings2 className="size-3.5 shrink-0" />
                Gestionar carreras
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </aside>
  )
}
