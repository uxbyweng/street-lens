import { ArtworkList } from "@/components/artworks/artwork-list";
import { getLatestArtworks } from "@/lib/data/artworks";

export default async function HomePage() {
  const latestArtworks = await getLatestArtworks(3);

  return (
    <>
      <section className="mx-auto rounded-2xl border p-6">
        <h1 className="text-3xl font-semibold">Track street art.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Save artworks with photos, notes, and location.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-6xl">
        <h2 className="text-lg font-semibold mb-4">Recently added ...</h2>
        <ArtworkList artworks={latestArtworks} />
      </section>
    </>
  );
}
