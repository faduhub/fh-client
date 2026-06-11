# Brief FE — Identidad / Cuenta (Fase 0)

Plan de implementación en `fh-client` de la **identidad pseudónima**: onboarding,
settings y la base de cuenta. Mapea el contrato del backend
(`fh-api/docs/feature-identity.md` + `frontend-identity-brief.md`) sobre el boilerplate
que ya tenemos (`http.server.ts` → services → actions → `ActionResult` → hooks + Base UI),
el mismo que montamos para comments.

> **Regla de oro:** nada de `fetch` suelto en componentes. Reads por **service** (server),
> writes por **action** (`"use server"`) envueltas en `action()`. El `username` es la
> identidad pública; el nombre real es privado y opcional.

---

## 0. Resumen de lo que se construye

| Pieza                                     | Estado backend | Construir en FE                                        |
| ----------------------------------------- | -------------- | ------------------------------------------------------ |
| `GET /users/me`                           | ✅ listo       | Service + bootstrap de sesión                          |
| `PATCH /users/me`                         | ✅ listo       | Action + form de settings                              |
| `PATCH /users/me/username`                | ✅ listo       | Action + onboarding/settings con cooldown              |
| `GET /users/username-available`           | ✅ listo       | Action + hook con debounce                             |
| Onboarding carrera + año                  | ❌ no existe   | **No construir** (Fase 0.5/1)                          |
| Perfil público con `username`             | ❌ shape viejo | **No atar fuerte** (`/usuario/[slug]` queda como está) |
| `author` → `username` en reviews/comments | ❌ shape viejo | Esperar aviso de cambio de shape                       |

---

## 1. Tipos / DTOs

**Nuevo** `lib/api/dtos/responses/me.ts`:

```ts
export type Me = {
  id: string
  username: string | null // null => needsOnboarding
  firstName: string | null
  lastName: string | null
  bio: string
  image: string | null
  hideRealName: boolean
  canChangeUsernameAt: string | null // ISO; null = puede cambiar ya
  needsOnboarding: boolean // true si username == null
  degrees: { name: string; slug: string; currentYear: number | null }[]
}
```

**Nuevo** `lib/api/dtos/payloads/account.ts`:

```ts
export type UpdateProfilePayload = Partial<{
  firstName: string
  lastName: string
  bio: string
  hideRealName: boolean
}>

export type ChangeUsernamePayload = { username: string }
```

---

## 2. Envelope canónico (confirmado con el dev)

Todo viaja bajo `data`. Estandarización confirmada (se entrega en un PR aparte de
"estandarización de envelope"; hasta entonces hay un par de endpoints con el shape viejo
y los absorbemos con tolerancia / `getRaw`).

| Caso                               | Forma                                       |
| ---------------------------------- | ------------------------------------------- |
| Recurso único (GET/POST/PATCH)     | `{ success, data: <DTO> }`                  |
| Lista paginada                     | `{ success, ...pagination, data: <DTO[]> }` |
| Sin payload (DELETE / side-effect) | `{ success: true }`                         |
| Error                              | `{ success: false, code, message }`         |

- **POST** → `201 { success, data: <DTO creado> }` (con `id`, `createdAt`) → optimista sin refetch.
- **PATCH** → `200 { success, data: <recurso actualizado> }` → ahorra el `getMe()` extra.
- **`username-available`** → `{ success, data: { available } }` (se mueve adentro de `data`).
- **Errores con `code` estable** → ramificá por `code`, **nunca** parsees `message` (es humano,
  puede traer fecha). Genéricos: `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403),
  `NOT_FOUND` (404), `CONFLICT` (409), `TOO_MANY_REQUESTS` (429), `INTERNAL` (500).
  Identidad: `USERNAME_TAKEN` (409), `USERNAME_COOLDOWN` (400), `USERNAME_INVALID` (400).

**Implementado en el client:**

- `ApiError` ahora lleva `code`; `ActionResult` error expone `error` (mensaje) + `code`.
- `http.getRaw` queda como red de seguridad para respuestas fuera de `data`:
  ```ts
  getRaw: <T>(path, opts?) => rawRequest("GET", path, opts) as Promise<T>
  ```
- **Transición:** `isUsernameAvailable` lee `res.data?.available ?? res.available ?? false`
  (funciona con el shape viejo y el nuevo, sin coordinar deploy).

> ⚠️ A junio 2026 el PR de envelope **no está deployado**: comments-POST devuelve `void`,
> los PATCH van pelados, y `username-available` tiene `available` en la raíz. El client ya
> está codeado contra el spec nuevo; la tolerancia / `getRaw` cubren el período intermedio.

---

## 3. Service — `lib/api/services/account.service.server.ts`

Reads autenticados y **per-user** ⇒ `auth: true` + `cache: "no-store"` (mismo criterio
que `likedByMe` en comments: no se puede cachear por tag).

```ts
import { http } from "@/lib/api/http.server"
import type { Me } from "@/lib/api/dtos/responses/me"

const READ = { auth: true, cache: "no-store" } as const

export const accountService = {
  /** Identidad + preferencias del usuario logueado. null si no hay sesión. */
  async getMe(): Promise<Me | null> {
    try {
      return await http.get<Me>("/users/me", READ)
    } catch {
      return null // 401 → sin sesión
    }
  },

  /** Disponibilidad de username (formato inválido => false). */
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const res = await http.getRaw<{ available: boolean }>(
        `/users/username-available?username=${encodeURIComponent(username)}`,
        READ,
      )
      return res.available
    } catch {
      return false
    }
  },
}
```

---

## 4. Actions — `lib/api/actions/account.actions.ts`

```ts
"use server"
// PATCH devuelve el Me actualizado bajo `data` (envelope canónico).
export async function updateProfileAction(payload: UpdateProfilePayload) {
  return action(() => http.patch<Me>("/users/me", { body: payload, auth: true }))
}
export async function changeUsernameAction(username: string) {
  return action(() => http.patch<Me>("/users/me/username", { body: { username }, auth: true }))
}
export async function checkUsernameAction(username: string) {
  return action(() => accountService.isUsernameAvailable(username))
}
```

> En fallo, `action()` devuelve `{ success: false, error, code }`. **Ramificá por `code`**
> (`USERNAME_TAKEN`, `USERNAME_COOLDOWN`, `USERNAME_INVALID`), no por `error` (que es el
> mensaje humano para el toast).

---

## 5. Hook — `lib/hooks/use-username-check.ts`

Validación en vivo: regex en cliente + disponibilidad con **debounce ~300ms** vía
`checkUsernameAction`. Estados: `idle | invalid | checking | available | taken`.

```ts
const USERNAME_RE = /^[a-z0-9_]{3,20}$/

// useUsernameCheck(initial?) → { value, setValue, status, message }
// - status "invalid" si !USERNAME_RE.test(v)
// - debounce → checkUsernameAction(v) → "available" | "taken"
// - cancelar el check anterior si el usuario sigue tipeando (ignorar respuesta stale)
```

Espeja las reglas del backend en el cliente (`3–20`, `[a-z0-9_]`, minúsculas) para feedback
inmediato y ahorrar requests cuando el formato ya es inválido.

---

## 6. Rutas / páginas

```
app/(main)/onboarding/page.tsx        ← server: getMe(); si !needsOnboarding → redirect("/")
app/(main)/onboarding/onboarding-form.tsx  ← client: username + check en vivo + changeUsernameAction
app/(main)/configuracion/page.tsx     ← server: getMe(); si null → redirect("/login")
app/(main)/configuracion/profile-form.tsx  ← client: firstName/lastName/bio + toggle hideRealName
app/(main)/configuracion/username-form.tsx ← client: cambio de username con guardia de cooldown
```

**Bootstrap de sesión:** al cargar la app, `getMe()`. Si `needsOnboarding` → empujar a
`/onboarding`. Candidato a `middleware.ts` (hoy no hay) o a un guard en el layout de `(main)`.
**Decisión a tomar antes de codear** (ver §9).

---

## 7. Componentes (Base UI, ya instalado)

- **Onboarding:** card centrada, `Input` de username con adorno `@`, ícono de estado
  (check verde / cruz roja / spinner) según `status` del hook, `Button` submit deshabilitado
  salvo `status === "available"`. Onboarding **siempre salteable** ("Por ahora no").
- **Profile form (settings):** `Input` firstName/lastName, `Textarea` (el que hicimos para
  comments) para `bio` con contador ≤280, `Switch`/checkbox Base UI para `hideRealName`
  ("Mostrar mi nombre real"). Submit → `updateProfileAction` → toast.
- **Username form (settings):** si `me.canChangeUsernameAt != null` → input deshabilitado +
  texto "Podés cambiarlo el DD/MM". Si es `null` → editable con el mismo hook de check.
- **Toasts y errores:** reusar `Toast.useToastManager()`. `401` en cualquier action → redirigir
  a `/login` (el `.error` ya viene; mapear status si hace falta diferenciarlo).

---

## 8. Mostrar autor / identidad (cuando migre el shape)

Hoy reviews/comments traen el shape viejo de autor. Cuando el backend migre a
`username`/`authorUsername` (Pendiente #1 del backend):

- Mostrar **`@username`** como identidad principal.
- Nombre real **chico, estilo IG**, solo si `hideRealName === false`.
- Tocar `review-card/header.tsx`, `review-card/footer.tsx` y `comment-card.tsx`.

**No** lo construimos todavía: el aviso de cambio de shape lo manda el backend.

---

## 9. Decisiones a confirmar antes de codear

1. **Guard de onboarding:** ¿`middleware.ts` (redirige antes del render, más prolijo) o
   guard en el layout `(main)` con `getMe()`? Middleware no puede leer el `Me` sin un
   roundtrip; el layout sí. Propongo **guard en layout**.
2. **Fuente de verdad de sesión en cliente:** ya existe `lib/auth-client.ts` (Better Auth,
   `useSession`). ¿`getMe()` (server) como fuente de la identidad y `useSession` solo para
   estado de login? Propongo **sí**: `Me` viene del backend, no de Better Auth.
3. **Ruta de settings:** `/configuracion` (español, consistente con `/resena`, `/catedra`).

---

## 10. Lo que NO se construye en esta tanda

1. Onboarding de **carrera + año** — no hay endpoint de escritura (`UserDegree`). `GET /me`
   ya trae `degrees` si existen, pero no se pueden setear.
2. **Perfil público** con `username`/`displayName` — `GET /users/:slug` sigue con shape viejo
   (`name`); `app/(main)/usuario/[slug]` queda como está.
3. **`author`/`authorUsername`** en reviews/comments — esperar el cambio de shape.
4. **DMs, posts, descubrimiento por overlap** — fases posteriores.

---

## Checklist de implementación

- [x] `dtos/responses/me.ts` + `dtos/payloads/account.ts`
- [x] `http.getRaw` en `http.server.ts`
- [x] `account.service.server.ts` (`getMe`, `isUsernameAvailable`)
- [x] `account.actions.ts` (`updateProfile`, `changeUsername`, `checkUsername`)
- [x] `use-username-check.ts` (regex + debounce + cancelación de stale)
- [x] `tsc --noEmit` limpio (capa de datos)
- [x] Envelope confirmado + decisiones §9 (guard en layout, `getMe` fuente de identidad, `/configuracion`)
- [x] Páginas onboarding + configuración
- [x] Componentes Base UI (`Switch`) + toasts
- [x] Guard en `(main)/layout` + skip por cookie
- [x] Entrada en el menú del header
