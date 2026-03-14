import { ArtworkList } from "@/components/artworks/artwork-list";
import { getArtworks } from "@/lib/data/artworks";
import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/page-intro";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artworks",
  description: "Browse all saved artworks in STREETLENS.",
};

export default async function ArtworksPage() {
  const artworks = await getArtworks();

  return (
    <>
      <PageIntro
        title="Artwork List"
        subtitle="Overview of all available artworks to quickly discover interesting artworks."
        action={{
          label: "Add artwork",
          href: "/artworks/new",
        }}
      />

      <section className="mx-auto mt-8 max-w-6xl">
        <ArtworkList artworks={artworks} />
      </section>
    </>
  );
}
