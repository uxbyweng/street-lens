"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { AuthDropdown } from "@/components/auth/auth-dropdown";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandInstagram,
} from "@tabler/icons-react";

export function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAdmin = session?.user?.role === "admin";

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/map", label: "Map" },
    { href: "/artworks", label: "Artworks" },
    ...(isAdmin ? [{ href: "/artworks/new", label: "Add Artwork" }] : []),
    { href: "/imprint", label: "Imprint" },
    ...(session?.user ? [{ href: "/profile", label: "Profile" }] : []),
  ];

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href;
  }

  return (
    <>
      <div className="flex items-center gap-3 md:hidden">
        {session?.user ? <AuthDropdown /> : null}

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative z-50 flex h-10 w-10 items-center justify-center"
        >
          <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>

          <div className="relative h-5 w-6">
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-6 bg-foreground transition-all duration-300 ${
                isOpen ? "translate-y-0 rotate-45" : "-translate-y-2.25"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 bg-foreground transition-all duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-6 bg-foreground transition-all duration-300 ${
                isOpen ? "translate-y-0 -rotate-45" : "translate-y-1.75"
              }`}
            />
          </div>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-400 md:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-background/99 backdrop-blur-sm" />

        <div className="relative flex h-full flex-col px-6 pb-8 pt-24">
          <nav className="flex flex-1 flex-col">
            <ul className="space-y-5">
              {navItems.map((item) => (
                <li key={item.href} className="border-b pb-3">
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className={`text-2xl font-fjalla uppercase transition-colors ${
                      isActive(item.href) ? "text-pink-500" : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li className="pt-4">
                {status === "loading" ? (
                  <span className="text-sm">Loading...</span>
                ) : !session?.user ? (
                  <Button
                    asChild
                    type="button"
                    variant="default"
                    size="lg"
                    className="mt-2 w-32"
                  >
                    <Link href="/login" onClick={closeMenu}>
                      Sign in
                    </Link>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      closeMenu();
                      signOut({ redirectTo: "/" });
                    }}
                  >
                    Sign out
                  </Button>
                )}
              </li>
            </ul>
          </nav>

          <div className="mt-8 space-y-3">
            <p className="text-lg font-medium text-muted-foreground">
              Get in touch
            </p>

            <div className="flex items-center gap-2">
              <TextLink
                href="https://github.com/uxbyweng/street-lens"
                target="_blank"
              >
                <IconBrandGithub
                  size={40}
                  stroke={1.8}
                  className="text-sky-600"
                />
              </TextLink>

              <TextLink
                href="https://www.linkedin.com/in/kweng/"
                target="_blank"
              >
                <IconBrandLinkedin
                  size={40}
                  stroke={1.8}
                  className="text-sky-600"
                />
              </TextLink>

              <TextLink
                href="https://www.instagram.com/blnstreetview/"
                target="_blank"
              >
                <IconBrandInstagram
                  size={40}
                  stroke={1.8}
                  className="text-sky-600"
                />
              </TextLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
