import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  rows = 3,
  ...props
}: InputPrimitive.Props & { rows?: number }) {
  return (
    <InputPrimitive
      data-slot="textarea"
      render={<textarea rows={rows} />}
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 field-sizing-content min-h-16 w-full resize-none rounded-lg border bg-transparent px-3 py-2 text-base leading-relaxed transition-colors outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
