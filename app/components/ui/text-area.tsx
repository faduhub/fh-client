import { Input } from "@base-ui/react/input"
import { cn } from "@/lib/utils"
import { inputBase } from "./input-base"

export function TextArea({ className, rows, ...props }: Input.Props & { rows?: number }) {
  return (
    <Input
      {...props}
      render={<textarea rows={rows} />}
      className={cn(inputBase, "min-h-28 resize-y", className)}
    />
  )
}
