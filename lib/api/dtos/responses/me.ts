/** Identidad + preferencias del usuario logueado (`GET /users/me`). */
export type Me = {
  id: string
  username: string | null // null => needsOnboarding
  slug: string | null
  firstName: string | null
  lastName: string | null
  bio: string
  image: string | null
  hideRealName: boolean
  canChangeUsernameAt: string | null // ISO; null = puede cambiar ya
  needsOnboarding: boolean // true si username == null
  degrees: Array<{ name: string; slug: string; currentYear: number | null }>
}
