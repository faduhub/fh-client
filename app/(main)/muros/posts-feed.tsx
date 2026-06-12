"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import Link from "next/link"
import { SearchIcon, PlusIcon } from "lucide-react"
import type { Post } from "@/lib/api/dtos/responses/post"
import type { Paginated } from "@/lib/api/dtos/responses/pagination"
import { PostCard } from "@/app/components/post-card"
import { cn } from "@/lib/utils"

type Props = {
  result: Paginated<Post>
  meSlug?: string | null
}

export function PostsFeed({ result, meSlug }: Props) {
  const router = useRouter()
  const sp = useSearchParams()

  const search = sp.get("search") ?? ""
  const order = sp.get("order") ?? "recent"
  const page = Number(sp.get("page") ?? 1)

  const push = useCallback(
    (params: Record<string, string | undefined>) => {
      const next = new URLSearchParams(sp.toString())
      for (const [k, v] of Object.entries(params)) {
        if (v) next.set(k, v)
        else next.delete(k)
      }
      next.delete("page")
      router.push(`/muros?${next}`)
    },
    [router, sp],
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-border bg-card flex items-center gap-2 rounded-md border px-3 py-2">
          <SearchIcon className="text-muted-foreground size-4 shrink-0" />
          <input
            type="text"
            defaultValue={search}
            placeholder="Buscar posts..."
            className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") push({ search: e.currentTarget.value || undefined })
            }}
            onBlur={(e) => {
              if (e.currentTarget.value !== search)
                push({ search: e.currentTarget.value || undefined })
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="border-border flex overflow-hidden rounded-md border">
            {[
              { value: "recent", label: "Recientes" },
              { value: "top", label: "Top" },
            ].map((o) => (
              <button
                key={o.value}
                onClick={() => push({ order: o.value })}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  order === o.value
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>

          {meSlug && (
            <Link
              href="/muros/nuevo"
              className="bg-foreground text-background inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
            >
              <PlusIcon className="size-3.5" />
              Nuevo post
            </Link>
          )}
        </div>
      </div>

      {/* Count */}
      <p className="text-muted-foreground text-sm">
        <span className="text-foreground font-medium">{result.total}</span>{" "}
        {result.total === 1 ? "post" : "posts"}
      </p>

      {/* List */}
      {result.data.length > 0 ? (
        <div className="flex flex-col gap-4">
          {result.data.map((p) => (
            <PostCard key={p.id} post={p} meSlug={meSlug} />
          ))}
        </div>
      ) : (
        <div className="border-border border border-dashed py-20 text-center">
          <p className="text-foreground text-2xl font-semibold tracking-tight">Sin posts</p>
          <p className="text-muted-foreground mt-2 text-sm">
            {search ? "Probá con otra búsqueda." : "Sé el primero en publicar algo."}
          </p>
          {meSlug && (
            <Link
              href="/muros/nuevo"
              className="text-accent mt-4 inline-block text-sm font-medium underline underline-offset-4"
            >
              Crear el primer post
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {result.numberOfPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          {result.prevPage && (
            <Link
              href={`/muros?${new URLSearchParams({ ...Object.fromEntries(sp), page: String(result.prevPage) })}`}
              className="border-border text-muted-foreground hover:text-foreground rounded-md border px-3 py-1.5 text-sm transition-colors"
            >
              ← Anterior
            </Link>
          )}
          <span className="text-muted-foreground text-sm">
            {page} / {result.numberOfPages}
          </span>
          {result.nextPage && (
            <Link
              href={`/muros?${new URLSearchParams({ ...Object.fromEntries(sp), page: String(result.nextPage) })}`}
              className="border-border text-muted-foreground hover:text-foreground rounded-md border px-3 py-1.5 text-sm transition-colors"
            >
              Siguiente →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
