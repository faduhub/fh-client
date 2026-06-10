/** Edición de perfil (`PATCH /users/me`). Todos los campos son opcionales. */
export type UpdateProfilePayload = Partial<{
  firstName: string // ≤ 50
  lastName: string // ≤ 50
  bio: string // ≤ 280
  hideRealName: boolean
}>

/** Cambio de username (`PATCH /users/me/username`). */
export type ChangeUsernamePayload = { username: string }
