"use client"

import { Plus } from "lucide-react"
import { SectionCard } from "./settings-fields"

import { ConfirmDialog } from "./confirm-dialog"
import { Toast } from "./toast"
import type { Me } from "@/lib/api/dtos/responses/me"
import { CursadasList } from "@/app/(main)/mi-fadu/cursadas/cursadas-list"
import { AddCursadaDialog } from "@/app/(main)/mi-fadu/cursadas/add-cursada-dialog"
import { EditCursadaDialog } from "@/app/(main)/mi-fadu/cursadas/edit-cursada-dialog"
import { CarreraDialog } from "@/app/(main)/carreras/add-carrera-dialog"
import { DegreeSidebar } from "@/app/(main)/carreras/degree-sidebar"
import { EmptyDegreeState } from "@/app/(main)/carreras/empty-degree-state"
import { useEnrolledDegrees } from "@/lib/hooks/use-enrolled-degrees"
import { useCursadas } from "@/lib/hooks/use-cursadas"
import { filterCursadasByDegree } from "@/lib/cursadas/filter-cursadas"

const eyebrowClass = "text-muted-foreground font-mono text-[0.7rem] tracking-widest uppercase"
const pillButtonClass =
  "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"

export function CursadasPanel({ me }: { me: Me }) {
  const toast = Toast.useToastManager()

  const degrees = useEnrolledDegrees(me, toast)
  const cursadas = useCursadas(toast)

  const visibleCursadas = filterCursadasByDegree({
    cursadas: cursadas.cursadas,

    activeDegree: degrees.activeDegree,

    enrolledDegreesCount: degrees.enrolledDegrees.length,
  })

  const carreraDialog = (
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
  )

  if (!degrees.hasEnrolledDegrees) {
    return (
      <EmptyDegreeState
        loadingDegrees={degrees.loadingDegrees}
        onAddDegree={() => degrees.setCarreraDialogOpen(true)}
        carreraDialog={carreraDialog}
      />
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <DegreeSidebar
          activeDegree={degrees.activeDegree}
          enrolledDegrees={degrees.enrolledDegrees}
          username={me.username}
          onActiveDegreeChange={degrees.setActiveDegreeId}
          onManageDegrees={() => degrees.setCarreraDialogOpen(true)}
        />

        <div className="min-w-0 flex-1">
          <SectionCard
            title="Materias cursadas"
            description="Tu historial académico: las materias que cursaste o estás cursando, con su cátedra y estado."
          >
            <div className="flex items-center justify-between">
              <span className={eyebrowClass}>Historial</span>
              <span className={eyebrowClass}>
                {visibleCursadas.length} {visibleCursadas.length === 1 ? "materia" : "materias"}
              </span>
            </div>

            <CursadasList
              cursadas={visibleCursadas}
              loading={cursadas.loadingData}
              pending={cursadas.isPending}
              onEditRequest={cursadas.openEdit}
              onDeleteRequest={cursadas.setCursadaToDelete}
            />

            <button
              type="button"
              onClick={() => cursadas.setMateriaDialogOpen(true)}
              disabled={cursadas.loadingData}
              className={`${pillButtonClass} self-end`}
            >
              <Plus className="size-4" strokeWidth={2} />
              Agregar
            </button>
          </SectionCard>
        </div>
      </div>

      {carreraDialog}

      <ConfirmDialog
        open={cursadas.cursadaToDelete !== null}
        onOpenChange={(open) => !open && cursadas.setCursadaToDelete(null)}
        title="Quitar materia"
        description={
          cursadas.cursadaToDelete
            ? `¿Seguro que querés quitar "${cursadas.cursadaToDelete.subject.name}" de tus cursadas?`
            : undefined
        }
        confirmLabel="Quitar"
        destructive
        onConfirm={cursadas.confirmDeleteCursada}
      />

      <AddCursadaDialog
        open={cursadas.materiaDialogOpen}
        onOpenChange={cursadas.handleMateriaOpenChange}
        subjectId={cursadas.subjectId}
        departmentId={cursadas.departmentId}
        status={cursadas.status}
        subjects={cursadas.subjects}
        availableDepts={cursadas.availableDepts}
        pending={cursadas.isPending}
        onSubjectChange={cursadas.handleSubjectChange}
        onDepartmentChange={cursadas.setDepartmentId}
        onStatusChange={cursadas.setStatus}
        onAddCursada={cursadas.handleAddCursada}
      />

      <EditCursadaDialog
        cursada={cursadas.editingCursada}
        onOpenChange={cursadas.handleEditOpenChange}
        departmentId={cursadas.editDepartmentId}
        status={cursadas.editStatus}
        availableDepts={cursadas.editAvailableDepts}
        pending={cursadas.isPending}
        onDepartmentChange={cursadas.setEditDepartmentId}
        onStatusChange={cursadas.setEditStatus}
        onEditCursada={cursadas.handleEditCursada}
      />
    </>
  )
}
