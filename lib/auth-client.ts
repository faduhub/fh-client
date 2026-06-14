import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  // Mismo origen que el front: en el browser usa window.location.origin (así
  // funciona en cualquier deploy/preview de Vercel) y los requests a /api/auth
  // se proxean a la API vía rewrites de Next. La cookie de sesión queda como
  // de primera parte. En SSR cae a una URL válida para no romper el prerender.
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    inferAdditionalFields({
      user: {
        username: {
          type: "string" as const,
          required: true,
        },
      },
    }),
  ],
})

export const { signIn, signOut, signUp, useSession } = authClient
