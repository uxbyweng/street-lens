import { auth } from "@/auth";
import { ArtworkList } from "@/components/artworks/artwork-list";
import { getLatestArtworks } from "@/lib/data/artworks";
import { HeroSlider } from "@/components/home/hero-slider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  const latestArtworks = await getLatestArtworks(3, session?.user?.id);

  return (
    <>
      <div className="relative w-full h-[calc(100vh-5rem)] md:h-[calc(100vh-5rem)] overflow-hidden">
        <HeroSlider />
      </div>

      <section className="mx-auto max-w-6xl my-10 lg:my-20 px-4">
        <div className="mb-10">
          <h2 className="font-fjalla uppercase text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2">
            Newest Artworks
          </h2>
          <p className="text-gray-400">Recently added ...</p>
        </div>
        <ArtworkList artworks={latestArtworks} />
        <Button asChild className="w-full md:w-auto mt-8 lg:mt-10">
          <Link
            href="/artworks"
            className="group inline-flex items-center gap-2 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span>Show all artworks</span>
            <ChevronRight
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Button>
      </section>
    </>
  );
}
