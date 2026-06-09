"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import AppMenu from "./ui/menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function SiteHeader() {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex sm:justify-between w-full">
                  <Link href="/" className="flex items-baseline gap-2">
          <span className="text-2xl font-bold leading-none tracking-tight text-foreground">
            faduHub
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            UBA
          </span>
        </Link>
          <div className="flex gap-x-5"><Link
            href="/"
            className="transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/catedras"
            className="transition-colors hover:text-foreground"
          >
            Cátedras
          </Link></div>

          {session ? (
            <div className="flex gap-x-5 items-center">
              <Link
                href="/nueva-resena"
                className="rounded-full bg-foreground px-4 py-1.5 text-background transition-opacity hover:opacity-90"
              >
                Nueva reseña
              </Link>
              <AppMenu
              
                trigger={<Avatar className="size-8">
            <AvatarFallback className="bg-secondary text-xs font-medium text-secondary-foreground">
              {session.user.name[0]}
            </AvatarFallback>
          </Avatar>}
                options={[
                  { label: "Perfil", onClick: () => router.push("/perfil/" + session.user.slug) },
                  // { label: "Configuración", onClick: () => router.push("/configuracion") },
                  { label: "Logout", onClick: handleSignOut, separator: true },
                ]}
              />
            </div>
          ) : (
            <div className="flex gap-x-5 items-center">
              <Link
                href="/login"
                className="transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/registro"
                className="rounded-full bg-foreground px-4 py-1.5 text-background transition-opacity hover:opacity-90"
              >
                Sign in
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
