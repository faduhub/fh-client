import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
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
