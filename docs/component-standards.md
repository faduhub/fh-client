# Estandar de componentes FE

Guia interna para organizar componentes en `fh-client` con Next.js App Router.
El objetivo es evitar duplicacion, mantener clara la frontera server/client y que
cada componente viva cerca del nivel donde realmente se reutiliza.

> **Regla de oro:** todo componente empieza siendo Server Component. Agregamos
> `"use client"` solo cuando el archivo necesita estado, eventos, efectos, hooks
> de cliente o APIs del navegador.

---

## 1. Directorios

Usamos tres niveles de componentes:

```txt
app/
  components/
    ui/
      button.tsx
      input.tsx
      avatar.tsx
    site-header.tsx
    reviews-feed.tsx

  (main)/
    usuario/[slug]/
      page.tsx
      _components/
        user-profile-shell.tsx
        user-profile-tabs.tsx
```

### `app/components/ui`

Componentes base, reutilizables y principalmente presentacionales.

Van aca:

- Wrappers de librerias UI.
- Componentes visuales propios: `Button`, `Input`, `Textarea`, `Badge`, `Avatar`,
  `Card`, `Switch`, `Select`, `Toast`, etc.
- Componentes sin conocimiento del dominio de FaduHub.
- Componentes que reciben datos por props y no hacen fetch.

No van aca:

- Componentes que conocen rutas especificas.
- Componentes que hacen llamadas a servicios/actions.
- Componentes atados a una feature concreta, como settings, reviews o perfil,
  salvo que sean primitives reutilizables.
- Componentes con copy o comportamiento muy especifico de una pagina.

### `app/components`

Componentes compartidos de aplicacion.

Van aca:

- Componentes usados por varias rutas pero que ya conocen algo del producto.
- Layouts compartidos, headers, feeds, cards de dominio, formularios compartidos.
- Componentes que componen primitives de `ui` con reglas de negocio livianas.

Ejemplos:

- `site-header.tsx`
- `reviews-feed.tsx`
- `comment-card.tsx`
- `review-card/*`

### `app/**/_components`

Componentes especificos de una ruta o feature.

Van aca:

- Componentes que solo se usan dentro de una page o segmento.
- Formularios especificos de una pantalla.
- Tabs, panels, shells o bloques que no tienen reutilizacion real todavia.

Ejemplo:

```txt
app/(main)/configuracion/
  page.tsx
  _components/
    profile-form.tsx
    username-form.tsx
```

Si despues un componente se reutiliza en dos o mas rutas, se sube a
`app/components`. Si se vuelve una primitive sin dominio, se sube a
`app/components/ui`.

---

## 2. Server Components por defecto

En App Router, las pages, layouts y componentes son Server Components por defecto.
Esto es lo que queremos para:

- Fetching de datos desde services.
- Acceso a cookies, headers o auth del server.
- Render inicial con menos JavaScript en el cliente.
- UI estatica o presentacional sin interaccion propia.

Ejemplo:

```tsx
import { accountService } from "@/lib/api/services/account.service.server"
import { ProfileHeadbar } from "@/app/components/ui/profile-headbar"

export default async function Page() {
  const me = await accountService.getMe()

  return <ProfileHeadbar username={me?.username ?? ""} />
}
```

---

## 3. Cuando usar `"use client"`

Un archivo debe tener `"use client"` si usa:

- `useState`, `useReducer`, `useEffect`, `useRef` para interaccion del browser.
- Event handlers propios como `onClick`, `onChange`, `onSubmit`.
- Hooks de cliente, por ejemplo `useRouter`, `usePathname`, `useSearchParams`.
- Browser APIs como `window`, `document`, `localStorage`, `navigator`.
- Librerias UI que internamente dependen de estado/effects y no exponen entrypoint
  compatible con Server Components.

Ejemplo:

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"

export function UsernameForm() {
  const [username, setUsername] = useState("")

  return (
    <form>
      <input value={username} onChange={(event) => setUsername(event.target.value)} />
      <Button type="submit">Guardar</Button>
    </form>
  )
}
```

Importante: si un archivo tiene `"use client"`, sus imports pasan a formar parte
del bundle cliente. Por eso la frontera client debe estar lo mas abajo posible.
No marcamos layouts, pages o directorios enteros como client salvo que sea necesario.

---

## 4. Props y composicion server/client

Los Server Components pueden renderizar Client Components, pero las props que cruzan
esa frontera deben ser serializables.

Bien:

```tsx
<UsernameForm initialUsername={me.username} canChangeAt={me.canChangeUsernameAt} />
```

Mal:

```tsx
<UsernameForm onSave={async () => updateUser()} />
```

Para writes usamos Server Actions importadas desde el Client Component cuando
corresponde, no funciones inventadas inline desde una page server.

---

## 5. Componentes UI

Los componentes en `app/components/ui` deben cumplir estas reglas:

- Reciben todo por props.
- No hacen fetch.
- No importan services.
- No importan actions salvo casos excepcionales y justificados.
- No conocen rutas especificas de la app.
- No contienen reglas de negocio.
- Pueden ser Server Components o Client Components segun su implementacion.

Un `Button` o `Badge` deberia ser usable desde server y client. Un `Dialog`,
`Menu`, `Combobox` o `Toast` probablemente necesite `"use client"` porque maneja
interaccion.

---

## 6. Componentes de dominio

Los componentes fuera de `ui` pueden conocer el producto, pero tienen que mantener
una responsabilidad clara.

Ejemplos:

- `review-card/*`: sabe mostrar una review.
- `comment-card.tsx`: sabe mostrar un comentario.
- `reviews-feed.tsx`: sabe ordenar/componer una lista de reviews.
- `site-header.tsx`: sabe navegar la app.

Si un componente empieza a mezclar fetch, estado, formularios, validaciones y UI
compleja, se divide:

- Container/server component: obtiene datos y decide redirects.
- Client component: maneja estado/interaccion.
- UI components: renderizan piezas presentacionales.

---

## 7. Pages y fetching

Las pages deben quedar como orquestadores finos:

- Leen params/searchParams.
- Hacen fetch server-side mediante services.
- Redirigen si hace falta.
- Componen componentes de ruta o compartidos.

No hacemos `fetch` suelto en componentes. Reads van por services server. Writes van
por actions con `"use server"` y el wrapper `action()` definido en el proyecto.

---

## 8. Criterio para mover componentes

Antes de crear o mover un componente, usamos esta decision:

1. Es una primitive visual reusable y sin dominio? `app/components/ui`.
2. Se usa en varias rutas y conoce algo de FaduHub? `app/components`.
3. Solo vive en una ruta o feature? `app/**/_components`.
4. Es logica no-React? `lib`.
5. Es hook reusable de cliente? `lib/hooks` o `app/components` solo si esta muy
   pegado a UI existente.

No abstraemos por adelantado. Primero dejamos el componente cerca de la ruta; lo
subimos cuando haya reutilizacion real o cuando reduzca complejidad concreta.

---

## 9. Naming

- Componentes React: `kebab-case.tsx` para archivos, `PascalCase` para exports.
- Componentes especificos de ruta: nombre por funcion, no por layout generico.
- Sufijo `Form`, `Panel`, `Card`, `Dialog`, `Menu`, `Shell` solo cuando describa
  bien la responsabilidad.
- Evitar nombres vagos como `content.tsx`, `section.tsx`, `wrapper.tsx` si no son
  primitives claras.

---

## 10. Checklist antes de mergear

- El componente esta en el nivel correcto (`ui`, compartido o `_components`).
- No hay `"use client"` mas arriba de lo necesario.
- Las props que cruzan server/client son serializables.
- No hay `fetch` suelto en UI.
- La logica de server vive en services/actions.
- El componente no conoce mas dominio del que necesita.
- No se creo una abstraccion sin reutilizacion real.
