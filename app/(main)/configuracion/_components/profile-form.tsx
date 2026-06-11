"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { Me } from "@/lib/api/dtos/responses/me"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Switch } from "@/app/components/ui/switch"
import { Toast } from "@/app/components/ui/toast"
import { updateProfileAction } from "@/lib/api/actions/account.actions"

const BIO_MAX = 280

export function ProfileForm({ me }: { me: Me }) {
  const router = useRouter()
  const toast = Toast.useToastManager()
  const [firstName, setFirstName] = useState(me.firstName ?? "")
  const [lastName, setLastName] = useState(me.lastName ?? "")
  const [bio, setBio] = useState(me.bio ?? "")
  const [showRealName, setShowRealName] = useState(!me.hideRealName)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateProfileAction({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
        hideRealName: !showRealName,
      })
      if (!res.success) {
        toast.add({ title: "No se pudo guardar", description: res.error, type: "error" })
        return
      }
      toast.add({ title: "Perfil actualizado", type: "success" })
      router.refresh()
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-card flex flex-col gap-5 rounded-md border p-6"
    >
      <div>
        <h2 className="text-foreground text-base font-semibold">Perfil</h2>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Tu nombre real es privado salvo que lo actives.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="firstName" className="text-foreground text-sm font-medium">
            Nombre
          </label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            maxLength={50}
            placeholder="Martina"
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="lastName" className="text-foreground text-sm font-medium">
            Apellido
          </label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            maxLength={50}
            placeholder="Ferreyra"
            className="h-9"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="bio" className="text-foreground text-sm font-medium">
          Bio
        </label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
          maxLength={BIO_MAX}
          rows={3}
          placeholder="Contá algo sobre vos."
        />
        <p className="text-muted-foreground text-right text-xs">
          {bio.length}/{BIO_MAX}
        </p>
      </div>

      <label className="border-border flex items-center justify-between gap-4 rounded-lg border p-3">
        <span className="min-w-0">
          <span className="text-foreground block text-sm font-medium">Mostrar mi nombre real</span>
          <span className="text-muted-foreground block text-xs">
            Aparece chico junto a tu username. Si está apagado, solo se ve tu @username.
          </span>
        </span>
        <Switch checked={showRealName} onCheckedChange={setShowRealName} />
      </label>

      <div>
        <Button type="submit" disabled={pending} size="sm">
          {pending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  )
}
