import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Check, FileIcon, ThumbsUp } from "lucide-react"
import { departmentService } from "@/lib/api/services/department.service.server"
import { postService } from "@/lib/api/services/post.service.server"
import { accountService } from "@/lib/api/services/account.service.server"
import { ReviewCard } from "@/app/components/review-card"
import { BoardPostsFeed } from "@/app/components/board-posts-feed"
import { Badge } from "@/app/components/ui/badge"
import { CatedraTabs } from "./catedra-tabs"

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
      <section className="">
        <div className="mx-auto max-w-5xl px-6 pt-12">
          <p className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
            {catedra.subjects.join(" / ")} · {catedra.degrees.join(" / ")}
          </p>
          <h1 className="text-foreground mt-2.5 text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-3xl">
            {catedra.name}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          {/* Sidebar de stats */}
          <aside className="bg-card border-border sticky top-6 hidden flex-col gap-5 rounded-md border p-5 lg:flex">
            <div className="text-foreground flex items-center gap-x-1.5 text-sm font-medium">
              <FileIcon className="size-3.5" />
              Detalle
            </div>

            <div className="border-border flex items-center justify-between border-t pt-4">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                La recomiendan
              </span>
              <span className="text-foreground inline-flex items-center gap-1.5 text-sm font-medium">
                <Check className="text-accent size-4" />
                {catedra.recommendPct}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Likes totales
              </span>
              <span className="text-foreground inline-flex items-center gap-1.5 text-sm font-medium">
                <ThumbsUp className="size-4" />
                {catedra.totalLikes}
              </span>
            </div>
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
              <CatedraTabs active={tab} />
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
                  catedra.reviews.map((r) => <ReviewCard key={r.id} review={r} />)
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
