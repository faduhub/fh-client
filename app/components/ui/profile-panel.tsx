"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { Toast } from "@/app/components/ui/toast"
import { Button } from "@/app/components/ui/button"
import { GradientAvatar } from "./gradient-avatar"
import {
  SectionCard,
  Field,
  FieldLabel,
  TextInput,
  TextArea,
  ToggleOptions,
} from "./settings-fields"
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
              <ToggleOptions
                value={hideRealName}
                onChange={setHideRealName}
                options={[
                  { value: false, label: "Visible" },
                  { value: true, label: "Oculto" },
                ]}
              />
            </Field>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-4 lg:w-56">
            <FieldLabel>Foto de perfil</FieldLabel>
            <div className="relative">
              <div
                aria-hidden="true"
                className="from-primary/40 via-accent/30 absolute -inset-2 rounded-full bg-linear-to-br to-transparent blur-xl"
              />
              <GradientAvatar seed={avatarSeed} className="border-border relative size-40 border" />
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
  )
}
