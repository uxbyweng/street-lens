import Link from "next/link";
import Image from "next/image";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { PrefetchingLink } from "@/components/navigation/prefetching-link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between px-4 sm:px-2 lg:px-0">
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
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <PrefetchingLink href="/map" className="hover:underline">
            Map
          </PrefetchingLink>
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
