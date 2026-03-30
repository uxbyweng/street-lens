import { auth } from "@/auth";
import { ArtworkList } from "@/components/artworks/artwork-list";
import { getLatestArtworks } from "@/lib/data/artworks";
import { HeroSlider } from "@/components/home/hero-slider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  const latestArtworks = await getLatestArtworks(3, session?.user?.id);

  return (
    <>
      <div className="relative w-full h-[calc(100vh-10rem)] md:h-[calc(100vh-5rem)] overflow-hidden">
        <HeroSlider />
      </div>

      <section className="mx-auto max-w-6xl my-5 lg:my-20 px-4">
        <div className="mb-5 lg:mb-10">
          <h2 className="font-fjalla uppercase text-3xl md:text-4xl lg:text-5xl font-black text-white">
            Newest Artworks
          </h2>
        </div>
        <ArtworkList
          artworks={latestArtworks}
          isAuthenticated={Boolean(session?.user)}
        />
        <Button asChild className="w-full md:w-auto mt-8 lg:mt-10">
          <Link
            href="/artworks"
            className="group inline-flex items-center gap-2 px-8 py-6 text-xl sm:px-10 sm:py-5 sm:text-1xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span>Show all artworks</span>
            <IconChevronRight
              size={30}
              stroke={4}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Button>
      </section>
    </>
  );
}
