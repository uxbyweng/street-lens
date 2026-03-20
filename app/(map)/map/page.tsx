import { getArtworks } from "@/lib/data/artworks";
import type { Metadata } from "next";
import { ArtworksMap } from "@/components/map/artworks-map";

// export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Map",
  description: "Overview map with all captured artworks.",
};

export default async function MapPage() {
  const artworks = await getArtworks();

  return (
    <section className="h-[calc(100dvh-var(--header-height))] w-full">
      <ArtworksMap artworks={artworks} className="h-full" />
    </section>
  );
}
