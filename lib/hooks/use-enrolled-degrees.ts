"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  getDegreesAction,
  joinDegreeAction,
  leaveDegreeAction,
} from "@/lib/api/actions/degree.actions"
import type { DegreeItem } from "@/lib/api/dtos/responses/degree"
import type { Me } from "@/lib/api/dtos/responses/me"

type EnrolledDegree = Me["degrees"][number]

type ToastManager = {
  add: (toast: { title: string; description?: string; type?: "success" | "error" }) => void
}

export function useEnrolledDegrees(me: Me, toast: ToastManager) {
  const router = useRouter()

  const [enrolledDegrees, setEnrolledDegrees] = useState<EnrolledDegree[]>(me.degrees)
  const [activeDegreeId, setActiveDegreeId] = useState<number | null>(me.degrees[0]?.id ?? null)

  const [allDegrees, setAllDegrees] = useState<DegreeItem[]>([])
  const [loadingDegrees, setLoadingDegrees] = useState(true)

  const [carreraDialogOpen, setCarreraDialogOpen] = useState(false)
  const [selectedDegreeId, setSelectedDegreeId] = useState("")

  const [degreesPending, startDegreeTransition] = useTransition()

  useEffect(() => {
    getDegreesAction().then((res) => {
      if (res.success) setAllDegrees(res.data)
      setLoadingDegrees(false)
    })
  }, [])

  const enrolledIds = useMemo(
    () => new Set(enrolledDegrees.map((degree) => degree.id)),
    [enrolledDegrees],
  )

  const availableToJoin = useMemo(
    () => allDegrees.filter((degree) => !enrolledIds.has(degree.id)),
    [allDegrees, enrolledIds],
  )

  const activeDegree = useMemo(
    () =>
      enrolledDegrees.find((degree) => degree.id === activeDegreeId) ?? enrolledDegrees[0] ?? null,
    [enrolledDegrees, activeDegreeId],
  )

  function handleJoinDegree() {
    const degree = allDegrees.find((degree) => String(degree.id) === selectedDegreeId)
    if (!degree) return

    startDegreeTransition(async () => {
      const res = await joinDegreeAction(selectedDegreeId)

      if (!res.success) {
        toast.add({
          title: "No se pudo anotar",
          description: res.error,
          type: "error",
        })
        return
      }

      setEnrolledDegrees((prev) => [
        ...prev,
        {
          id: degree.id,
          name: degree.name,
          slug: degree.slug,
          currentYear: null,
        },
      ])

      setActiveDegreeId((prev) => prev ?? degree.id)
      setSelectedDegreeId("")

      toast.add({
        title: `Anotado en ${degree.name}`,
        type: "success",
      })

      router.refresh()
    })
  }

  function handleLeaveDegree(degree: EnrolledDegree) {
    startDegreeTransition(async () => {
      const res = await leaveDegreeAction(String(degree.id))

      if (!res.success) {
        toast.add({
          title: "No se pudo salir",
          description: res.error,
          type: "error",
        })
        return
      }

      setEnrolledDegrees((prev) => {
        const next = prev.filter((item) => item.id !== degree.id)

        setActiveDegreeId((current) => {
          if (current !== degree.id) return current
          return next[0]?.id ?? null
        })

        return next
      })

      toast.add({
        title: `Saliste de ${degree.name}`,
        type: "success",
      })

      router.refresh()
    })
  }

  return {
    enrolledDegrees,
    activeDegree,
    activeDegreeId,
    setActiveDegreeId,

    allDegrees,
    availableToJoin,
    selectedDegreeId,
    setSelectedDegreeId,

    loadingDegrees,
    degreesPending,

    carreraDialogOpen,
    setCarreraDialogOpen,

    handleJoinDegree,
    handleLeaveDegree,

    hasEnrolledDegrees: enrolledDegrees.length > 0,
  }
}
