"use client";

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthControls() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="text-sm">Loading...</span>;
  }

  if (!session?.user) {
    return (
      <Button type="button" onClick={() => signIn("github")}>
        Sign in
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {session.user.image ? (
        <Image
          src={session.user.image}
          alt={session.user.name ?? "User avatar"}
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : null}

      <div className="hidden flex-col text-xs leading-tight sm:flex">
        <span>{session.user.name ?? session.user.username ?? "User"}</span>
        <span>{session.user.role}</span>
      </div>

      <Button type="button" variant="outline" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}
