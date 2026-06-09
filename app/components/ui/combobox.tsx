"use client"

import { Combobox as BaseCombobox } from "@base-ui/react/combobox"
import { ChevronDown, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type ComboboxOption = { value: string; label: string }

export function Combobox({
  label,
  options,
  value,
  onChange,
  placeholder = "Filtrar...",
  className,
}: {
  label: string
  options: ComboboxOption[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  const ALL = ""
  const selected = value ? options.find((o) => o.value === value) ?? null : null

  return (
    <BaseCombobox.Root
      items={options}
      value={selected}
      onValueChange={(item) => onChange(item ? item.value : ALL)}
    >
      <BaseCombobox.InputGroup
        className={cn(
          "flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm font-medium transition-colors cursor-pointer",
          selected
            ? "border-foreground bg-foreground text-background"
            : "border-border text-foreground hover:border-foreground/50",
          className,
        )}
      >
        <BaseCombobox.Input
          placeholder={selected ? selected.label : label}
          className="w-28 bg-transparent outline-none placeholder:text-current truncate cursor-pointer"
        />
        {selected ? (
          <BaseCombobox.Clear
            onClick={() => onChange(ALL)}
            className="shrink-0 opacity-70 hover:opacity-100"
            aria-label="Limpiar"
          >
            <X className="size-3.5" />
          </BaseCombobox.Clear>
        ) : (
          <BaseCombobox.Trigger className="shrink-0 opacity-50" aria-label="Abrir">
            <ChevronDown className="size-3.5" />
          </BaseCombobox.Trigger>
        )}
      </BaseCombobox.InputGroup>

      <BaseCombobox.Portal>
        <BaseCombobox.Positioner sideOffset={6} align="start">
          <BaseCombobox.Popup className="z-50 min-w-56 rounded-md border border-border bg-popover shadow-lg outline-none">
            <BaseCombobox.Empty className="px-3 py-4 text-center text-xs text-muted-foreground">
              Sin resultados
            </BaseCombobox.Empty>
            <BaseCombobox.List className="max-h-60 overflow-y-auto py-1">
              {(item: ComboboxOption) => (
                <BaseCombobox.Item
                  key={item.value}
                  value={item}
                  className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm outline-none transition-colors data-[highlighted]:bg-muted"
                >
                  <BaseCombobox.ItemIndicator className="flex size-3.5 shrink-0 items-center justify-center">
                    <Check className="size-3.5" />
                  </BaseCombobox.ItemIndicator>
                  {item.label}
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  )
}
