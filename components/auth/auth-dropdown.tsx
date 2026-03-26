"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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
      <Button asChild type="button">
        <Link href="/login" className="cursor-pointer">
          Sign in
        </Link>
      </Button>
    );
  }

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        type="button"
        aria-label="Open user menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
          <div className="px-3">
            <p className="truncate text-sm font-medium">
              {session.user.name ?? session.user.username ?? "User"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {session.user.role}
            </p>
          </div>

          <div className="flex flex-col gap-2 p-3">
            <Link
              href="/profile"
              className="cursor-pointer text-sm transition-colors hover:text-pink-500 border-t border-b py-3"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/imprint"
              className="cursor-pointer text-sm transition-colors hover:text-pink-500 pb-3"
              onClick={() => setIsOpen(false)}
            >
              Imprint
            </Link>

            <Button
              type="button"
              variant="outline"
              className="cursor-pointer justify-start"
              onClick={() => {
                setIsOpen(false);
                signOut({ redirectTo: "/" });
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
