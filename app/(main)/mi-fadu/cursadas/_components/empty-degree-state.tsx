"use-client"

import { Button } from "@/app/components/ui/button"
import { GraduationCap, Plus } from "lucide-react"
import { ReactNode } from "react"

type EmptyDegreeStateProps = {
  loadingDegrees: boolean
  onAddDegree: () => void
  carreraDialog: ReactNode
}

export function EmptyDegreeState({
  loadingDegrees,
  onAddDegree,
  carreraDialog,
}: EmptyDegreeStateProps) {
  return (
    <>
      <div className="border-border bg-card/80 flex flex-col items-center gap-4 rounded-2xl border border-dashed px-6 py-16 text-center backdrop-blur-sm">
        <div className="bg-secondary/60 flex size-12 items-center justify-center rounded-full">
          <GraduationCap className="text-primary size-6" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-foreground font-serif text-lg font-medium">
            Todavía no cargaste tu carrera
          </p>
          <p className="text-muted-foreground mx-auto mt-1 max-w-xs text-sm">
            Agregá tu carrera para empezar a registrar las materias que cursás.
          </p>
        </div>
        <Button onClick={onAddDegree} disabled={loadingDegrees} className="rounded-full">
          <Plus />
          Agregar carrera
        </Button>
      </div>
      {carreraDialog}
    </>
  )
}
