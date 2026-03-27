import { ArtworkCard } from "@/components/artworks/artwork-card";
import type { Artwork } from "@/types/artwork";

type ArtworkListItem = Artwork & {
  likeCount?: number;
  isLiked?: boolean;
};

type ArtworkListProps = {
  artworks?: ArtworkListItem[];
  isLikedFilterActive?: boolean;
  onArtworkRemoved?: (artworkId: string) => void;
};

export function ArtworkList({
  artworks = [],
  isLikedFilterActive = false,
  onArtworkRemoved,
}: ArtworkListProps) {
  if (artworks.length === 0) {
    return (
      <section className="space-3">
        <p className="p-2 text-lg">No artworks yet.</p>
      </section>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.map((artwork, index) => (
        <li key={artwork._id}>
          <ArtworkCard
            artwork={artwork}
            href={`/artworks/${artwork._id}`}
            index={index}
            isLikedFilterActive={isLikedFilterActive}
            onArtworkRemoved={onArtworkRemoved}
          />
        </li>
      ))}
    </ul>
  );
}
