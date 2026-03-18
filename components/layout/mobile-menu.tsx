"use client";

import Link from "next/link";

export function MobileMenu() {
  return (
    <>
      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={false}
          className="relative z-50 flex h-10 w-10 items-center justify-center"
        >
          <span className="sr-only">Open menu</span>
          <div className="relative h-5 w-6">
            <span className="absolute left-0 top-0 h-0.5 w-6 bg-foreground transition-all duration-300" />
            <span className="absolute left-0 top-2 h-0.5 w-6 bg-foreground transition-all duration-300" />
            <span className="absolute left-0 top-4 h-0.5 w-6 bg-foreground transition-all duration-300" />
          </div>
        </button>
      </div>

      <div className="fixed inset-0 z-40 md:hidden transition-opacity duration-300 pointer-events-none opacity-0">
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />

        <div className="relative flex h-full flex-col px-6 pb-8 pt-24">
          <nav className="flex flex-1 flex-col justify-center">
            <ul className="space-y-6">
              <li>
                <Link href="/" className="text-2xl font-semibold">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/map/" className="text-2xl font-semibold">
                  Map View
                </Link>
              </li>
              <li>
                <Link href="/artworks/" className="text-2xl font-semibold">
                  Artwork List
                </Link>
              </li>
              <li>
                <Link href="/artworks/new/" className="text-2xl font-semibold">
                  Add Artwork
                </Link>
              </li>
              <li>
                <Link href="/imprint/" className="text-2xl font-semibold">
                  Imprint
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
