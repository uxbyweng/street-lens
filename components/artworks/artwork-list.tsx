import Link from "next/link";
import { ArtworkCard } from "@/components/artworks/artwork-card";
import type { Artwork } from "@/types/artwork";

type ArtworkListProps = {
  artworks?: Artwork[];
};

export function ArtworkList({ artworks = [] }: ArtworkListProps) {
  if (artworks.length === 0) {
    return (
      <section className="space-y-3">
        <p>No artworks yet. Start by adding one.</p>
        <Link href="/artworks/new" className="underline">
          Add a new artwork
        </Link>
      </section>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.map((artwork) => (
        <li key={artwork._id}>
          <ArtworkCard artwork={artwork} variant="preview" />
        </li>
      ))}
    </ul>
  );
}
