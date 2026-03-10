import { AppShell } from "@/components/layout/app-shell";
import { ArtworkList } from "@/components/artworks/artwork-list";
import { getArtworks } from "@/lib/data/artworks";

export default async function ArtworksPage() {
  const artworks = await getArtworks();

  return (
    <AppShell>
      <section className="mx-auto rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold">Artwork List</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Overview of all available artworks to quickly discover interesting
          artworks.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-6xl">
        <ArtworkList artworks={artworks} />
      </section>
    </AppShell>
  );
}
