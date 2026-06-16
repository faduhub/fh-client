import type { NextConfig } from "next"
const API_ORIGIN = process.env.API_URL || "http://localhost:4000"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/mi-fadu",
        destination: "/mi-fadu/cursadas",
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
