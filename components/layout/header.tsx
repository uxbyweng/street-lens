import Link from "next/link";
import Image from "next/image";
import { MobileMenu } from "@/components/layout/mobile-menu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex min-h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" aria-label="Go to Homepage">
          <Image
            src="/images/logo-streetlens-light.png"
            width={132}
            height={39}
            alt="STREETLIST"
            priority
          />
        </Link>

        <nav className="flex items-center gap-4 text-sm hidden md:block">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/map" className="hover:underline">
            Map
          </Link>
          <Link href="/artworks" className="hover:underline">
            Artworks
          </Link>
          <Link href="/artworks/new" className="hover:underline">
            Add Artwork
          </Link>
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}
