"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { PrefetchingLink } from "@/components/navigation/prefetching-link";

export default function Header() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href;
  }
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between px-4 lg:px-3">
        <Link href="/" aria-label="Go to Homepage" className="z-60">
          <Image
            src="/images/logo_street_lens.png"
            width={210}
            height={40}
            alt="STREETLIST"
            priority
            sizes="132px"
          />
        </Link>

        <nav className="hidden items-center gap-6 text-lg md:flex font-fjalla uppercase">
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
          <Link
            href="/artworks/new"
            className={`transition-colors hover:underline ${
              isActive("/artworks/new") ? "text-pink-500" : "text-foreground"
            }`}
          >
            Add Artwork
          </Link>
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}
