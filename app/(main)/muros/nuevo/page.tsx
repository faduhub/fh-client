import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { accountService } from "@/lib/api/services/account.service.server"
import { degreeService } from "@/lib/api/services/degree.service.server"
import { subjectService } from "@/lib/api/services/subject.service.server"
import { departmentService } from "@/lib/api/services/department.service.server"
import type { BoardType } from "@/lib/api/dtos/responses/post"
import { PostForm } from "./post-form"

const BOARD_TYPES = new Set<BoardType>(["GENERAL", "CARRERA", "MATERIA", "CATEDRA"])

export default async function NuevoPostPage({
  searchParams,
}: {
  searchParams: Promise<{ boardType?: string; boardId?: string }>
}) {
  const me = await accountService.getMe()
  if (!me) redirect("/login")

  const sp = await searchParams
  const initialBoardType: BoardType =
    sp.boardType && BOARD_TYPES.has(sp.boardType as BoardType)
      ? (sp.boardType as BoardType)
      : "GENERAL"
  const initialBoardId = sp.boardId ?? ""

  const [degrees, subjects, departments] = await Promise.all([
    degreeService.getAll(),
    subjectService.getAll(),
    departmentService.getAll(),
  ])

  return (
    <main className="bg-background min-h-screen">
      <section className="mx-auto max-w-2xl px-6 pt-12">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          Muros
        </Link>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">Nuevo post</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Publicá en el feed general o en el muro de una carrera, materia o cátedra.
          </p>
        </div>
        <PostForm
          degrees={degrees}
          subjects={subjects}
          departments={departments}
          initialBoardType={initialBoardType}
          initialBoardId={initialBoardId}
        />
      </section>
    </main>
  )
}
