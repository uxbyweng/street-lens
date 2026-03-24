"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { PrefetchingLink } from "@/components/navigation/prefetching-link";
import { AuthDropdown } from "@/components/auth/auth-dropdown";

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href;
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between px-4 lg:px-3">
        <Link href="/" aria-label="Go to Homepage" className="z-60 shrink-0">
          <Image
            src="/images/logo_street_lens.png"
            width={210}
            height={40}
            alt="STREETLENS"
            priority
            sizes="132px"
          />
        </Link>

        <div className="hidden md:flex items-center justify-end gap-3 ml-auto">
          <nav className="flex items-center gap-5 text-lg font-fjalla uppercase">
            <Link
              href="/"
              className={`transition-colors hover:underline ${
                isActive("/") ? "text-pink-500" : "text-foreground"
              }`}
            >
              Home
            </Link>

            <PrefetchingLink
              href="/map"
              className={`transition-colors hover:underline ${
                isActive("/map") ? "text-pink-500" : "text-foreground"
              }`}
            >
              Map
            </PrefetchingLink>

            <Link
              href="/artworks"
              className={`transition-colors hover:underline ${
                isActive("/artworks") ? "text-pink-500" : "text-foreground"
              }`}
            >
              Artworks
            </Link>

            {isAdmin ? (
              <Link
                href="/artworks/new"
                className={`transition-colors hover:underline ${
                  isActive("/artworks/new")
                    ? "text-pink-500"
                    : "text-foreground"
                }`}
              >
                Add Artwork
              </Link>
            ) : null}
          </nav>

          <div className="ml-2">
            <AuthDropdown />
          </div>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
