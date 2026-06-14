"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw, Trash2, AlertTriangle } from "lucide-react"
import { Toast } from "@/app/components/ui/toast"
import { Button } from "@/app/components/ui/button"
import { Switch } from "@/app/components/ui/switch"
import { GradientAvatar } from "./gradient-avatar"
import { SectionCard, Field, FieldLabel, TextInput, TextArea } from "./settings-fields"
import { updateProfileAction } from "@/lib/api/actions/account.actions"
import type { Me } from "@/lib/api/dtos/responses/me"

const BIO_MAX = 280

export function ProfilePanel({ me }: { me: Me }) {
  const router = useRouter()
  const toast = Toast.useToastManager()

  const [firstName, setFirstName] = useState(me.firstName ?? "")
  const [lastName, setLastName] = useState(me.lastName ?? "")
  const [bio, setBio] = useState(me.bio ?? "")
  const [hideRealName, setHideRealName] = useState(me.hideRealName)
  const [showEmail, setShowEmail] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateProfileAction({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
        hideRealName,
      })
      if (!res.success) {
        toast.add({ title: "No se pudo guardar", description: res.error, type: "error" })
        return
      }
      toast.add({ title: "Perfil actualizado", type: "success" })
      router.refresh()
    })
  }

  const avatarSeed = [firstName, lastName].filter(Boolean).join(" ") || me.username || "usuario"

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        title="Perfil público"
        description="Esta información se muestra en tu perfil y junto a tus experiencias."
      >
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            <div className="flex flex-1 flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre">
                  <TextInput
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    maxLength={50}
                    placeholder="Tu nombre"
                  />
                </Field>
                <Field label="Apellido">
                  <TextInput
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    maxLength={50}
                    placeholder="Tu apellido"
                  />
                </Field>
              </div>

              <Field label="Bio" hint={`${bio.length}/${BIO_MAX} caracteres`}>
                <TextArea
                  value={bio}
                  onChange={(e) => setBio(String(e.target.value).slice(0, BIO_MAX))}
                  rows={3}
                  placeholder="Contá algo sobre vos."
                />
              </Field>

              <Field
                label="Nombre real"
                hint="Si está oculto, solo se ve tu @username en las experiencias."
              >
                <label className="flex cursor-pointer items-center gap-3">
                  <Switch
                    checked={!hideRealName}
                    onCheckedChange={(checked) => setHideRealName(!checked)}
                  />
                  <span className="text-foreground text-sm">Mostrar mi nombre real</span>
                </label>
              </Field>

              <Field label="Email" hint="Si lo desactivás, tu email no será visible públicamente.">
                <TextInput type="email" value={me.email ?? ""} readOnly placeholder="Sin email" />
                <label className="mt-3 flex cursor-pointer items-center gap-3">
                  <Switch checked={showEmail} onCheckedChange={setShowEmail} />
                  <span className="text-foreground text-sm">Mostrar email en el perfil</span>
                </label>
              </Field>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-4 lg:w-56">
              <FieldLabel>Foto de perfil</FieldLabel>
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="from-primary/40 via-accent/30 absolute -inset-2 rounded-full bg-linear-to-br to-transparent blur-xl"
                />
                <GradientAvatar
                  seed={avatarSeed}
                  className="border-border relative size-40 border"
                />
              </div>
              <button
                type="button"
                className="border-border bg-secondary/50 text-foreground hover:border-primary/40 hover:bg-secondary inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors"
              >
                <RefreshCw className="size-3.5" strokeWidth={1.5} />
                Regenerar avatar
              </button>
              <p className="text-muted-foreground/70 text-center text-xs leading-relaxed text-pretty">
                Tu avatar se genera a partir de tu nombre. También podés subir una imagen propia.
              </p>
            </div>
          </div>

          <div className="border-border mt-6 flex justify-end border-t pt-6">
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </SectionCard>

      <section className="border-destructive/40 bg-destructive/5 overflow-hidden rounded-2xl border">
        <div className="border-destructive/30 flex items-center gap-2 border-b px-6 py-5">
          <AlertTriangle className="text-destructive size-4" strokeWidth={1.5} />
          <h2 className="text-foreground font-serif text-xl font-medium tracking-tight">
            Zona de riesgo
          </h2>
        </div>
        <div className="flex items-center justify-between gap-4 p-6">
          <div className="leading-tight">
            <p className="text-foreground text-sm">Eliminar cuenta</p>
            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
              Esto borra tu perfil y todas tus experiencias. No se puede deshacer.
            </p>
          </div>
          <button
            type="button"
            className="border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20 inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Trash2 className="size-4" strokeWidth={1.5} />
            Eliminar
          </button>
        </div>
      </section>
    </div>
  )
}
