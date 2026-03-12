import { ArtworkList } from "@/components/artworks/artwork-list";
import { getArtworks } from "@/lib/data/artworks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artworks",
  description: "Browse all saved artworks in STREETLENS.",
};

type ArtworksPageProps = {
  searchParams: Promise<{
    success?: string;
  }>;
};

export default async function ArtworksPage({
  searchParams,
}: ArtworksPageProps) {
  const artworks = await getArtworks();
  const params = await searchParams;
  const showSuccessMessage = params.success === "created";

  return (
    <>
      <section className="mx-auto rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold">Artwork List</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Overview of all available artworks to quickly discover interesting
          artworks.
        </p>
      </section>

      {showSuccessMessage ? (
        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          Artwork successfully added.
        </div>
      ) : null}

      <section className="mx-auto mt-8 max-w-6xl">
        <ArtworkList artworks={artworks} />
      </section>
    </>
  );
}
