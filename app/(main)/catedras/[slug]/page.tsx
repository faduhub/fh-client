import { Suspense } from "react"
import { notFound } from "next/navigation"
import { departmentService } from "@/lib/api/services/department.service.server"
import { postService } from "@/lib/api/services/post.service.server"
import { accountService } from "@/lib/api/services/account.service.server"
import { ReviewCard } from "@/components/features/review-card"
import { BoardPostsFeed } from "@/app/components/board-posts-feed"
import { Badge } from "@/app/components/ui/badge"
import { CatedraTabs } from "./catedra-tabs"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"

export default async function CatedraPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const tab = sp.tab === "experiencias" ? "experiencias" : "muro"

  const [catedra, me] = await Promise.all([
    departmentService.getBySlug(slug),
    accountService.getMe(),
  ])
  if (!catedra) notFound()

  const posts =
    tab === "muro"
      ? await postService.getPosts({ boardType: "CATEDRA", boardId: catedra.id, limit: 20 })
      : null

  const tags = Array.from(new Set(catedra.reviews.flatMap((r) => r.tags)))

  return (
    <main className="bg-background min-h-screen">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div>
          <span className="text-primary font-mono text-[0.7rem] tracking-[0.2em] uppercase">
            FADU / UBA
          </span>
          <h1 className="text-foreground mt-1 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            {catedra.name}
          </h1>
          <div className="from-primary/60 via-border mt-5 h-px w-full bg-linear-to-r to-transparent" />
        </div>
        <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr]">
          {/* Sidebar de stats */}
          <aside className="bg-card border-border sticky top-6 hidden h-fit flex-col gap-5 rounded-md border p-5 lg:flex">
            <div className="border-border flex flex-col gap-2">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Carrera
              </span>
              <span className="text-foreground inline-flex items-center gap-1.5 text-sm font-medium">
                {catedra.degrees.join(" / ")}
              </span>
            </div>

            {catedra.subjects.length > 0 && (
              <div className="border-border flex flex-col gap-2 border-t pt-4">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Materias
                </span>
                <div className="flex flex-wrap gap-2">
                  {catedra.subjects.map((s) => (
                    <Badge key={s} variant="outline" className="rounded-full font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {tags.length > 0 && (
              <div className="border-border flex flex-col gap-2 border-t pt-4">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Tags
                </span>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Badge key={t} variant="secondary" className="rounded-full font-normal">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="border-border flex flex-col gap-2 border-t pt-4">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Links
              </span>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full font-normal">
                  Instagram
                </Badge>
                <Badge variant="secondary" className="rounded-full font-normal">
                  Web
                </Badge>
              </div>
            </div>
          </aside>

          {/* Columna principal con tabs */}
          <div className="flex flex-col gap-6">
            <Suspense>
              <div className="flex items-center justify-between">
                <CatedraTabs active={tab} />
                <Link href="/">
                  <Button>Crear</Button>
                </Link>
              </div>
              {/* <div className="flex items-center justify-end">
                      {meSlug && (
                        <Link
                          href={`/muros/nuevo?boardType=${boardType}&boardId=${boardId}`}
                          className="border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
                        >
                          <PlusIcon className="size-3.5" />
                          Nuevo post
                        </Link>
                      )}
                    </div> */}
            </Suspense>

            {tab === "muro" && posts && (
              <BoardPostsFeed
                result={posts}
                boardType="CATEDRA"
                boardId={catedra.id}
                meSlug={me?.slug ?? null}
              />
            )}

            {tab === "experiencias" && (
              <div className="flex flex-col gap-4">
                {catedra.reviews.length > 0 ? (
                  catedra.reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} currentUserSlug={me?.slug ?? null} />
                  ))
                ) : (
                  <div className="border-border border border-dashed py-12 text-center">
                    <p className="text-foreground font-semibold">Sin experiencias todavía</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Sé el primero en escribir una.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
