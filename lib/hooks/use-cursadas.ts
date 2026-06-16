"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import {
  getCursadasAction,
  getSubjectsAction,
  getDepartmentsAction,
  addCursadaAction,
  editCursadaAction,
  deleteCursadaAction,
} from "@/lib/api/actions/cursada.actions"
import type { Cursada, CursadaStatus } from "@/lib/api/dtos/responses/cursada"
import type { SubjectItem } from "@/lib/api/dtos/responses/subject"
import type { DepartmentStats } from "@/lib/api/dtos/responses/department"
import type { Me } from "@/lib/api/dtos/responses/me"

type EnrolledDegree = Me["degrees"][number]

type ToastManager = {
  add: (toast: { title: string; description?: string; type?: "success" | "error" }) => void
}

export function useCursadas(toast: ToastManager) {
  const [cursadas, setCursadas] = useState<Cursada[]>([])
  const [subjects, setSubjects] = useState<SubjectItem[]>([])
  const [departments, setDepartments] = useState<DepartmentStats[]>([])

  const [loadingData, setLoadingData] = useState(true)

  const [materiaDialogOpen, setMateriaDialogOpen] = useState(false)

  const [subjectId, setSubjectId] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [status, setStatus] = useState<CursadaStatus>("CURSANDO")

  const [cursadaToDelete, setCursadaToDelete] = useState<Cursada | null>(null)

  const [editingCursada, setEditingCursada] = useState<Cursada | null>(null)
  const [editDepartmentId, setEditDepartmentId] = useState("")
  const [editStatus, setEditStatus] = useState<CursadaStatus>("CURSANDO")

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    Promise.all([getCursadasAction(), getSubjectsAction(), getDepartmentsAction()]).then(
      ([cursadasRes, subjectsRes, depsRes]) => {
        if (cursadasRes.success) setCursadas(cursadasRes.data)
        if (subjectsRes.success) setSubjects(subjectsRes.data)
        if (depsRes.success) setDepartments(depsRes.data)

        setLoadingData(false)
      },
    )
  }, [])

  const selectedSubject = useMemo(
    () => subjects.find((subject) => String(subject.id) === subjectId),
    [subjects, subjectId],
  )

  const availableDepts = useMemo(() => {
    if (!selectedSubject) return []

    return departments.filter((department) =>
      selectedSubject.departments.some(
        (subjectDepartment) => subjectDepartment.slug === department.slug,
      ),
    )
  }, [departments, selectedSubject])

  const editAvailableDepts = useMemo(() => {
    if (!editingCursada) return []

    const subject = subjects.find((s) => s.slug === editingCursada.subject.slug)
    if (!subject) return []

    return departments.filter((department) =>
      subject.departments.some((subjectDepartment) => subjectDepartment.slug === department.slug),
    )
  }, [departments, subjects, editingCursada])

  function getVisibleCursadas(params: {
    activeDegree: EnrolledDegree | null
    enrolledDegreesCount: number
  }) {
    const { activeDegree, enrolledDegreesCount } = params

    if (!activeDegree || enrolledDegreesCount <= 1) {
      return cursadas
    }

    return cursadas.filter(
      (cursada) => !cursada.degree || cursada.degree.slug === activeDegree.slug,
    )
  }

  function handleSubjectChange(id: string) {
    setSubjectId(id)
    setDepartmentId("")
  }

  function handleMateriaOpenChange(open: boolean) {
    setMateriaDialogOpen(open)

    if (!open) {
      setSubjectId("")
      setDepartmentId("")
      setStatus("CURSANDO")
    }
  }

  function handleAddCursada() {
    if (!subjectId) return

    startTransition(async () => {
      const res = await addCursadaAction({
        subjectId,
        status,
        ...(departmentId ? { departmentId } : {}),
      })

      if (!res.success) {
        const msg =
          res.code === "CURSADA_DUPLICATE"
            ? "Ya tenés esta materia registrada para ese cuatrimestre."
            : res.error

        toast.add({
          title: "No se pudo agregar",
          description: msg,
          type: "error",
        })

        return
      }

      setCursadas((prev) => [...prev, res.data])
      handleMateriaOpenChange(false)

      toast.add({
        title: "Materia agregada",
        type: "success",
      })
    })
  }

  function handleDeleteCursada(id: string, name: string) {
    startTransition(async () => {
      const res = await deleteCursadaAction(id)

      if (!res.success) {
        toast.add({
          title: "No se pudo quitar",
          description: res.error,
          type: "error",
        })

        return
      }

      setCursadas((prev) => prev.filter((cursada) => cursada.id !== id))

      toast.add({
        title: `${name} quitada`,
        type: "success",
      })
    })
  }

  function confirmDeleteCursada() {
    if (!cursadaToDelete) return

    handleDeleteCursada(cursadaToDelete.id, cursadaToDelete.subject.name)
  }

  function openEdit(cursada: Cursada) {
    setEditingCursada(cursada)
    setEditStatus(cursada.status)
    setEditDepartmentId(
      cursada.department
        ? (departments.find((d) => d.slug === cursada.department?.slug)?.id ?? "")
        : "",
    )
  }

  function handleEditOpenChange(open: boolean) {
    if (!open) setEditingCursada(null)
  }

  function handleEditCursada() {
    if (!editingCursada) return

    startTransition(async () => {
      const res = await editCursadaAction(editingCursada.id, {
        status: editStatus,
        ...(editDepartmentId ? { departmentId: editDepartmentId } : {}),
      })

      if (!res.success) {
        toast.add({
          title: "No se pudo guardar",
          description: res.error,
          type: "error",
        })

        return
      }

      setCursadas((prev) =>
        prev.map((cursada) => (cursada.id === res.data.id ? res.data : cursada)),
      )
      setEditingCursada(null)

      toast.add({
        title: "Materia actualizada",
        type: "success",
      })
    })
  }

  return {
    cursadas,
    subjects,
    departments,
    selectedSubject,
    availableDepts,

    loadingData,
    isPending,

    materiaDialogOpen,
    setMateriaDialogOpen,
    handleMateriaOpenChange,

    subjectId,
    departmentId,
    status,

    setSubjectId,
    setDepartmentId,
    setStatus,

    cursadaToDelete,
    setCursadaToDelete,

    editingCursada,
    editDepartmentId,
    editStatus,
    editAvailableDepts,
    setEditDepartmentId,
    setEditStatus,
    openEdit,
    handleEditOpenChange,
    handleEditCursada,

    getVisibleCursadas,
    handleSubjectChange,
    handleAddCursada,
    handleDeleteCursada,
    confirmDeleteCursada,
  }
}
