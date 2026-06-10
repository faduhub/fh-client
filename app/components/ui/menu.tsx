import * as React from "react"
import { Menu } from "@base-ui/react/menu"
import { cn } from "@/lib/utils"

export interface MenuOption {
  label: string
  onClick?: () => void
  disabled?: boolean
  separator?: boolean
  destructive?: boolean
}

interface AppMenuProps {
  trigger: React.ReactNode
  options: MenuOption[]
  openOnHover?: boolean
}

export default function AppMenu({ trigger, options, openOnHover = false }: AppMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger openOnHover={openOnHover}>{trigger}</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className="outline-hidden" sideOffset={6} alignOffset={0}>
          <Menu.Popup className="bg-popover text-popover-foreground border-border min-w-36 origin-[var(--transform-origin)] rounded-md border p-1 shadow-md outline-hidden transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            {options.map((option, index) => (
              <React.Fragment key={index}>
                {option.separator && <Menu.Separator className="bg-border my-1 h-px" />}
                <Menu.Item
                  className={cn(itemClass, option.destructive && destructiveClass)}
                  disabled={option.disabled}
                  onClick={option.onClick}
                >
                  {option.label}
                </Menu.Item>
              </React.Fragment>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

const itemClass =
  "flex cursor-default items-center rounded-sm px-3 py-1.5 text-sm leading-5 outline-hidden select-none data-highlighted:bg-muted data-highlighted:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50"

const destructiveClass =
  "text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
