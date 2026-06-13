import { cn } from "@/lib/utils"
import { inputBase } from "./input-base"

export function SelectInput({
  children,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        inputBase,
        "[&>option]:bg-card [&>option]:text-foreground appearance-none",
        className,
      )}
    >
      {children}
    </select>
  )
}
