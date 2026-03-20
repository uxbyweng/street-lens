import { ArtworkList } from "@/components/artworks/artwork-list";
import { getLatestArtworks } from "@/lib/data/artworks";

import { PageIntro } from "@/components/layout/page-intro";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const latestArtworks = await getLatestArtworks(3);

  return (
    <>
      <PageIntro
        title="Track street art."
        subtitle="Save artworks with photos, notes, and location."
        action={{
          label: "Add artwork",
          href: "/artworks/new",
        }}
      />

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recently added ...</h2>
        <ArtworkList artworks={latestArtworks} />
      </section>
    </>
  );
}
