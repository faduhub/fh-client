"use client"

import { useMemo } from "react"

// Paleta de stops en la familia violeta / magenta / naranja (mantiene la paleta neo-emo)
const PALETTE = [
  "oklch(0.68 0.24 350)", // magenta eléctrico
  "oklch(0.62 0.2 300)", // violeta
  "oklch(0.72 0.2 35)", // naranja cálido
  "oklch(0.58 0.16 270)", // índigo
  "oklch(0.66 0.26 15)", // rojo-coral
  "oklch(0.3 0.06 300)", // violeta profundo (sombra)
]

function hashString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function pick<T>(arr: T[], n: number): T {
  return arr[n % arr.length]
}

/**
 * Avatar por defecto: mesh gradient determinista a partir del nombre/seed.
 * El mismo seed siempre genera el mismo avatar.
 */
export function GradientAvatar({
  seed,
  initial,
  className = "",
  showInitial = false,
}: {
  seed: string
  initial?: string
  className?: string
  showInitial?: boolean
}) {
  const style = useMemo(() => {
    const h = hashString(seed)
    const c1 = pick(PALETTE, h)
    const c2 = pick(PALETTE, h >> 3)
    const c3 = pick(PALETTE, h >> 6)
    const dark = "oklch(0.16 0.04 300)"

    // posiciones de los blobs derivadas del hash
    const p = (shift: number, mod: number, base = 10) => base + ((h >> shift) % mod)

    return {
      backgroundColor: dark,
      backgroundImage: [
        `radial-gradient(circle at ${p(1, 60, 15)}% ${p(2, 60, 15)}%, ${c1} 0%, transparent 55%)`,
        `radial-gradient(circle at ${p(4, 60, 30)}% ${p(5, 60, 25)}%, ${c2} 0%, transparent 55%)`,
        `radial-gradient(circle at ${p(7, 50, 45)}% ${p(8, 50, 50)}%, ${c3} 0%, transparent 60%)`,
        `radial-gradient(circle at 80% 85%, ${dark} 0%, transparent 50%)`,
      ].join(", "),
    } as const
  }, [seed])

  return (
    <div
      role="img"
      aria-label={`Avatar de ${seed}`}
      className={`relative overflow-hidden rounded-full ${className}`}
      style={style}
    >
      {showInitial && initial && (
        <span className="text-foreground/90 absolute inset-0 flex items-center justify-center font-serif mix-blend-overlay">
          {initial}
        </span>
      )}
      {/* brillo sutil superior para dar volumen */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent"
      />
    </div>
  )
}
