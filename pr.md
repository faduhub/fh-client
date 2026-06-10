# feat: Identidad pseudónima — onboarding, cuenta y settings (Fase 0)

Implementa el FE de la **identidad pseudónima** sobre los endpoints de `/users/me`
(ver `fh-api/docs/feature-identity.md`). El `username` pasa a ser la identidad pública;
el nombre real queda privado y opcional. Incluye la capa de datos reutilizable
(boilerplate), el flujo de onboarding y la pantalla de configuración.

Brief de implementación: `docs/frontend-identity-brief.md`.

---

## Qué entra

### Capa de datos (boilerplate replicable)
- **`lib/api/dtos/responses/me.ts`** — tipo `Me` (identidad + preferencias).
- **`lib/api/dtos/payloads/account.ts`** — `UpdateProfilePayload`, `ChangeUsernamePayload`.
- **`lib/api/services/account.service.server.ts`** — `getMe` (envuelto en `cache()` de React
  para deduplicar layout + página) e `isUsernameAvailable`. Reads `auth + no-store`
  (per-user, no cacheables por tag — mismo criterio que `likedByMe` en comments).
- **`lib/api/actions/account.actions.ts`** — `updateProfileAction`, `changeUsernameAction`
  (PATCH, devuelven `Me`), `checkUsernameAction`, `dismissOnboardingAction` (cookie de skip).

### Envelope canónico + manejo de errores
- **`http.server.ts`**: `ApiError` ahora lleva `code`; nuevo `http.getRaw` para respuestas
  fuera de `data` (red de seguridad durante la transición de envelope).
- **`action.server.ts`**: `ActionResult` en fallo expone `error` (mensaje humano) + `code`
  (estable, para ramificar la UI sin parsear texto).

### Hook
- **`lib/hooks/use-username-check.ts`** — validación en vivo: regex en cliente
  (`/^[a-z0-9_]{3,20}$/`) + disponibilidad con **debounce 300ms** y **descarte de respuestas
  stale**. Estados: `idle | invalid | checking | available | taken`.

### Onboarding (`/onboarding`, fuera de `(main)`)
- Server page: si no hay sesión → `/login`; si ya tiene username → `/`.
- Form con `@`-input, ícono de estado (check / cruz / spinner), submit deshabilitado salvo
  `available`. **Salteable** ("Por ahora no") vía cookie de sesión.

### Configuración (`/configuracion`, dentro de `(main)`)
- **UsernameForm** — cambio con guardia de **cooldown** (si `canChangeUsernameAt != null`,
  input deshabilitado + "Podés cambiarlo el DD/MM"). Toast en éxito/error.
- **ProfileForm** — nombre, apellido, bio (contador ≤280) y toggle **"Mostrar mi nombre real"**
  (`hideRealName`). Toast en éxito/error.

### Guard + UI
- **`(main)/layout.tsx`** ahora es `async`: si el usuario logueado tiene `needsOnboarding`
  (y no salteó) → redirige a `/onboarding`. El browsing público no se ve afectado.
- **`ui/switch.tsx`** — Switch de Base UI estilado con los tokens del theme.
- **`site-header.tsx`** — se habilita la entrada "Configuración" en el menú de usuario.

---

## Decisiones de diseño

- **Guard en el layout `(main)`** (no middleware): puede leer el `Me` sin un roundtrip extra.
  `/onboarding` vive fuera de `(main)` para no loopear.
- **`getMe()` (server) como fuente de verdad de la identidad**; `useSession` (Better Auth)
  queda solo para estado de login.
- **Onboarding salteable con cookie de sesión** (`fh_onboarding_skipped`, sin `maxAge`):
  convive con el guard sin atrapar al usuario; reaparece la próxima sesión.
- **Errores por `code`, no por `message`** (el mensaje es humano y puede traer fecha).

---

## ⚠️ Notas para el revisor

- **Envelope en transición:** el PR de "estandarización de envelope" del backend todavía
  **no está deployado**. El client ya está codeado contra el spec nuevo (`{ success, data }`
  en todo, `code` en errores) y absorbe el shape viejo con tolerancia:
  `isUsernameAvailable` lee `res.data?.available ?? res.available`. `getRaw` queda como fallback.
- **Pendientes del backend (no se construyen acá):** onboarding de carrera+año (no hay endpoint
  de escritura), perfil público con `username`/`displayName` (`GET /users/:slug` sigue con
  shape viejo), y `author → username` en reviews/comments. La página `usuario/[slug]` queda igual.
- **`getMe()` corre en cada navegación de `(main)`** (también anónimos → 401 cacheado por request).
  Tradeoff aceptado; se puede optimizar gateando por presencia de cookie de sesión más adelante.
- **Error preexistente fuera de scope:** `site-header.tsx:55` (`session.user.slug`) ya fallaba
  antes de este PR (tipo de Better Auth sin `slug`); no se toca acá.

---

## Testing

- `npx tsc --noEmit` → limpio salvo el error preexistente de `site-header.tsx` (ver arriba).
- Validación manual pendiente con sesión real (cambio de username + cooldown, toggle
  `hideRealName`, skip de onboarding).

## Archivos

**Nuevos**
- `lib/api/dtos/responses/me.ts`, `lib/api/dtos/payloads/account.ts`
- `lib/api/services/account.service.server.ts`, `lib/api/actions/account.actions.ts`
- `lib/hooks/use-username-check.ts`
- `app/components/ui/switch.tsx`
- `app/onboarding/{page,onboarding-form}.tsx`
- `app/(main)/configuracion/{page,profile-form,username-form}.tsx`
- `docs/frontend-identity-brief.md`

**Modificados**
- `lib/api/http.server.ts` (`ApiError.code`, `getRaw`)
- `lib/api/action.server.ts` (`code` en `ActionResult`)
- `app/(main)/layout.tsx` (guard de onboarding)
- `app/components/site-header.tsx` (entrada "Configuración")
