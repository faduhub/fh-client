"use client"

import { SectionCard } from "@/app/components/ui/section-card"
import { RecorridoStats } from "./recorrido-stats"
import { SuggestedCarreras } from "./suggested-carreras"
import { Recorrido } from "@/lib/api/dtos/responses/recorrido"
import { AppEmptyState } from "@/app/components/ui/empty-state"
import { Me } from "@/lib/api/dtos/responses/me"
import { useEnrolledDegrees } from "@/lib/hooks/use-enrolled-degrees"
import { Toast } from "@base-ui/react"
import { CarreraDialog } from "../../cursadas/_components/add-carrera-dialog"

export default function RecorridoPanel({ recorrido, me }: { recorrido: Recorrido | null; me: Me }) {
  const toast = Toast.useToastManager()
  const degrees = useEnrolledDegrees(me, toast)
  if (!recorrido) {
    return (
      <AppEmptyState
        onPrimaryClick={() => degrees.setCarreraDialogOpen(true)}
        isLoading={degrees.loadingDegrees}
        title="Todavía no cargaste tu carrera"
        text="Agregá tu carrera para empezar a registrar las materias que cursás."
        label="Agregar carrera"
      >
        <CarreraDialog
          open={degrees.carreraDialogOpen}
          onOpenChange={degrees.setCarreraDialogOpen}
          enrolledDegrees={degrees.enrolledDegrees}
          availableToJoin={degrees.availableToJoin}
          selectedDegreeId={degrees.selectedDegreeId}
          onSelectedDegreeIdChange={degrees.setSelectedDegreeId}
          pending={degrees.degreesPending}
          onJoinDegree={degrees.handleJoinDegree}
          onLeaveDegree={degrees.handleLeaveDegree}
        />
      </AppEmptyState>
    )
  }

  return (
    <div className="space-y-5">
      <SectionCard
        title="Tu recorrido"
        description="Según las materias que cargaste. No es un avance oficial."
      >
        <RecorridoStats recorrido={recorrido} />

        {recorrido && recorrido?.suggestedNext.length > 0 && (
          <SuggestedCarreras recorrido={recorrido} />
        )}
      </SectionCard>
    </div>
  )
}
