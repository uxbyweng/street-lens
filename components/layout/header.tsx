"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { PrefetchingLink } from "@/components/map/prefetching-link";
import { AuthDropdown } from "@/components/auth/auth-dropdown";

export default function Header() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between px-4 lg:px-3">
        <Link href="/" aria-label="Go to Homepage" className="z-60 shrink-0">
          <Image
            src="/images/logo-berlin-street-view.png"
            width={330}
            height={40}
            alt="BLN STREET VIEW"
            priority
            sizes="132px"
            className="w-55 h-auto"
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
