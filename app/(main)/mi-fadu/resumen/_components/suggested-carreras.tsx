"use client"

import { Badge } from "@/app/components/ui/badge"
import { Recorrido } from "@/lib/api/dtos/responses/recorrido"
import { Sparkles } from "lucide-react"

const eyebrowClass = "text-muted-foreground font-mono text-[0.7rem] tracking-widest uppercase"

export function SuggestedCarreras({ recorrido }: { recorrido: Recorrido }) {
  return (
    <div className="border-border rounded-xl border p-4">
      <p className={`flex items-center gap-2 ${eyebrowClass}`}>
        <Sparkles className="text-primary size-3.5" />
        Para explorar después
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {recorrido.suggestedNext.map((item) => (
          <Badge key={item.id} variant="outline" className="h-auto gap-2 px-3 py-1.5 text-sm">
            <span className="text-foreground">{item.name}</span>
            <span className="text-muted-foreground font-mono text-[0.65rem] tracking-widest uppercase">
              {item.year}° · {item.experiencesCount}{" "}
              {item.experiencesCount === 1 ? "experiencia" : "experiencias"}
            </span>
          </Badge>
        ))}
      </div>
    </div>
  )
}
