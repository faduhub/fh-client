"use client"

import { Button } from "@/app/components/ui/button"
import { GraduationCap, Plus } from "lucide-react"
import { ReactNode } from "react"

type AppEmptyStateProps = {
  isLoading: boolean
  onPrimaryClick: () => void
  children?: ReactNode
  title: string
  text: string
  label: string
}

export function AppEmptyState({
  isLoading,
  onPrimaryClick,
  children,
  title,
  label,
  text,
}: AppEmptyStateProps) {
  return (
    <>
      <div className="border-border bg-card/80 flex flex-col items-center gap-4 rounded-2xl border border-dashed px-6 py-16 text-center backdrop-blur-sm">
        <div className="bg-secondary/60 flex size-12 items-center justify-center rounded-full">
          <GraduationCap className="text-primary size-6" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-foreground font-serif text-lg font-medium">{title}</p>
          <p className="text-muted-foreground mx-auto mt-1 max-w-xs text-sm">{text}</p>
        </div>
        <Button onClick={onPrimaryClick} disabled={isLoading} className="rounded-full">
          <Plus />
          {label}
        </Button>
      </div>
      {children}
    </>
  )
}
