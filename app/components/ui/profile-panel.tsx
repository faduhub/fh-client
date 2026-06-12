"use client"

import { Globe, RefreshCw } from "lucide-react"
import { GradientAvatar } from "./gradient-avatar"
import {
  SectionCard,
  Field,
  FieldLabel,
  TextInput,
  TextArea,
  SelectInput,
  PrefixedInput,
} from "./settings-fields"

const PRONOUNS = ["No especificar", "ella", "él", "elle", "ella/elle", "él/elle"]

const socials = [
  { label: "in", placeholder: "https://linkedin.com/in/usuario" },
  { label: "ig", placeholder: "https://instagram.com/usuario" },
  { label: "gh", placeholder: "https://github.com/usuario" },
  { label: "sp", placeholder: "https://open.spotify.com/user/usuario" },
]

export function ProfilePanel() {
  return (
    <SectionCard
      title="Perfil público"
      description="Esta información se muestra en tu perfil y junto a tus experiencias."
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        {/* Form */}
        <div className="flex flex-1 flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre">
              <TextInput defaultValue="Martina" placeholder="Tu nombre" />
            </Field>
            <Field label="Apellido">
              <TextInput defaultValue="Ferreyra" placeholder="Tu apellido" />
            </Field>
          </div>

          <Field label="Usuario" hint="Tu URL pública: fadureviews.com/martina-ferreyra">
            <PrefixedInput
              prefix={<span className="font-mono text-sm">@</span>}
              defaultValue="martina-ferreyra"
              placeholder="usuario"
            />
          </Field>

          <Field label="Email público" hint="Visible en tu perfil. Podés ocultarlo desde Cuenta.">
            <TextInput
              type="email"
              defaultValue="martina@fadu.uba.ar"
              placeholder="vos@fadu.uba.ar"
            />
          </Field>

          <Field label="Bio" hint="Contá en qué andás. Máximo 160 caracteres.">
            <TextArea
              defaultValue="Estudiante de Diseño Gráfico. Dejo experiencias honestas para que elijas mejor tus cátedras."
              maxLength={160}
              placeholder="Contanos un poco sobre vos"
            />
          </Field>

          <Field label="Pronombres">
            <SelectInput defaultValue="ella">
              {PRONOUNS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Sitio web">
            <PrefixedInput
              prefix={<Globe className="size-4" strokeWidth={1.5} />}
              type="url"
              placeholder="https://tu-portfolio.com"
            />
          </Field>

          <div className="flex flex-col gap-2.5">
            <FieldLabel>Redes sociales</FieldLabel>
            {socials.map((s, i) => (
              <PrefixedInput
                key={i}
                prefix={
                  <span className="inline-flex size-5 items-center justify-center font-mono text-[0.7rem] uppercase">
                    {s.label}
                  </span>
                }
                type="url"
                placeholder={s.placeholder}
              />
            ))}
          </div>
        </div>

        {/* Foto */}
        <div className="flex shrink-0 flex-col items-center gap-4 lg:w-56">
          <FieldLabel>Foto de perfil</FieldLabel>
          <div className="relative">
            <div
              aria-hidden="true"
              className="from-primary/40 via-accent/30 absolute -inset-2 rounded-full bg-gradient-to-br to-transparent blur-xl"
            />
            <GradientAvatar
              seed="Martina Ferreyra"
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
          <button
            type="button"
            className="text-primary text-xs font-medium underline-offset-4 hover:underline"
          >
            Subir imagen
          </button>
        </div>
      </div>

      <div className="border-border flex justify-end border-t pt-6">
        <button
          type="button"
          className="bg-primary text-primary-foreground shadow-primary/60 hover:shadow-primary/80 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium shadow-[0_0_30px_-8px] transition-all"
        >
          Guardar cambios
        </button>
      </div>
    </SectionCard>
  )
}
