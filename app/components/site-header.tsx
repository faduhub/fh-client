"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-2xl font-bold leading-none tracking-tight text-foreground">
            cátedras
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            FADU
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <Link
            href="/#reseñas"
            className="transition-colors hover:text-foreground"
          >
            Reseñas
          </Link>
          <Link
            href="/catedras"
            className="transition-colors hover:text-foreground"
          >
            Cátedras
          </Link>

          {session ? (
            <>
              <Link
                href="/nueva-resena"
                className="rounded-full bg-foreground px-4 py-1.5 text-background transition-opacity hover:opacity-90"
              >
                Nueva reseña
              </Link>
              <span className="text-foreground">{session.user.name}</span>
              <button
                onClick={handleSignOut}
                className="transition-colors hover:text-foreground"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="transition-colors hover:text-foreground"
              >
                Ingresar
              </Link>
              <Link
                href="/nueva-resena"
                className="rounded-full bg-foreground px-4 py-1.5 text-background transition-opacity hover:opacity-90"
              >
                Dejar reseña
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
