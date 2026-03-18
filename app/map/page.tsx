import { getArtworks } from "@/lib/data/artworks";
import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/page-intro";
import { ArtworksMap } from "@/components/map/artworks-map";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Map",
  description: "Overview map with all captured artworks.",
};

export default async function MapPage() {
  const artworks = await getArtworks();

  return (
    <>
      <PageIntro
        title="Map"
        subtitle="Overview map with all captured artworks."
      />

      <section className="mx-auto mt-8 max-w-6xl">
        <ArtworksMap artworks={artworks} />
      </section>
    </>
  );
}
