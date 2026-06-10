"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "focus-visible:ring-ring/50 data-[checked]:bg-accent data-[unchecked]:bg-input inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent p-0.5 transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="bg-background size-4 rounded-full shadow-sm transition-transform data-[checked]:translate-x-4 data-[unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
