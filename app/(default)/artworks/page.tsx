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
        title="Artworks"
        subtitle="Overview of all available artworks to quickly discover interesting artworks."
        action={{
          label: "Add artwork",
          href: "/artworks/new",
        }}
        className="max-w-6xl"
      />

      <section className="mx-auto max-w-6xl my-8 px-4">
        <ArtworkList artworks={artworks} />
      </section>
    </>
  );
}
