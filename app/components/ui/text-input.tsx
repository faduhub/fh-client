import { Input } from "@base-ui/react/input"
import { cn } from "@/lib/utils"
import { inputBase } from "./input-base"

export function TextInput({ className, ...props }: Input.Props) {
  return <Input {...props} className={cn(inputBase, className)} />
}
