"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/map", label: "Map View" },
  { href: "/artworks", label: "Artwork List" },
  { href: "/artworks/new", label: "Add Artwork" },
  { href: "/imprint", label: "Impressum" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <>
      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={false}
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative z-50 flex h-10 w-10 items-center justify-center"
        >
          <span className="sr-only">
            {" "}
            {isOpen ? "Close menu" : "Open menu"}
          </span>
          <div className="relative h-5 w-6">
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-6  bg-foreground transition-all duration-300 ${
                isOpen ? "translate-y-0 rotate-45" : "-translate-y-2.25"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 bg-foreground transition-all duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-6  bg-foreground transition-all duration-300 ${
                isOpen ? "translate-y-0 -rotate-45" : "translate-y-1.75"
              }`}
            />
          </div>
        </button>
      </div>
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />

        <div className="relative flex h-full flex-col px-6 pb-8 pt-24">
          <nav className="flex flex-2 flex-col">
            <ul className="space-y-5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="text-2xl font-semibold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Button
                  asChild
                  type="button"
                  variant="default"
                  size="lg"
                  className="mt-5 w-30"
                >
                  <Link href="#" onClick={closeMenu}>
                    Login
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
