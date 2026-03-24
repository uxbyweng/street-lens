"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (status === "loading") {
    return <div className="text-sm">Loading...</div>;
  }

  if (!session?.user) {
    return (
      <Button type="button" onClick={() => signIn("github")}>
        Sign in
      </Button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="Open user menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User avatar"}
            width={36}
            height={36}
            className="rounded-full border"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium">
            {(session.user.name ?? session.user.username ?? "U")
              .charAt(0)
              .toUpperCase()}
          </div>
        )}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border bg-background p-3 shadow-lg">
          <div className="border-b pb-3">
            <p className="truncate text-sm font-medium">
              {session.user.name ?? session.user.username ?? "User"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {session.user.role}
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-3">
            <Link
              href="/profile"
              className="text-sm transition-colors hover:text-pink-500"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>

            <Button
              type="button"
              variant="outline"
              className="justify-start"
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
