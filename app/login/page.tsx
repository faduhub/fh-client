"use client";

import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <Link href="/" className="inline-flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              cátedras
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              FADU
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Iniciá sesión para dejar tu reseña
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-xs text-muted-foreground">
          ¿No tenés cuenta?{" "}
          <Link
            href="/registro"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
