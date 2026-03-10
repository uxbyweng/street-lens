import { AppShell } from "@/components/layout/app-shell";
import { ArtworkList } from "@/components/artworks/artwork-list";
import { mockArtworks } from "@/lib/mock-artworks";

export default function HomePage() {
  const latestThreeArtworks = [...mockArtworks]
    .sort((a, b) => {
      return (
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
      );
    })
    .slice(0, 3);

  return (
    <AppShell>
      <section className="mx-auto rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold">
          Awesome Streetart. <br />
          Well saved in your Map.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          A mobile-first app to collect, manage, and discover urban artworks
          with images, notes, and location data.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-6xl">
        <ArtworkList artworks={latestThreeArtworks} />
      </section>
    </AppShell>
  );
}
