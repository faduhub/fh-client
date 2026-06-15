import type { NextConfig } from "next"

// Origin de la API (CloudFront en prod, localhost en dev). Se usa para proxear
// las rutas de better-auth a través del mismo dominio del front, así la cookie
// de sesión es de primera parte (SameSite=Lax funciona) y no hay problemas de
// cookies de terceros entre vercel.app y cloudfront.net.
const API_ORIGIN = process.env.API_URL || "http://localhost:4000"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/mi-fadu",
        destination: "/mi-fadu/resumen",
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${API_ORIGIN}/api/auth/:path*`,
      },
    ]
  },
}

export default nextConfig
