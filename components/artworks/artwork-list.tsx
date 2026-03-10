import useSWR from "swr";
import { ArtworkCard } from "@/components/artworks/artwork-card";
// import useSWR from "swr";
import Link from "next/link";
// import { useRouter } from "next/router";

export default function ArtworkList({
  artworkcards = [],
  bookmarkIds = [],
  onToggleBookmark,
  onShowAnswer,
  showActions = true,
  onDelete,
}) {
  const { mutate } = useSWR("/api/artwork");

  return (
    <>
      {artworkcards.length === 0 && (
        <>
          <p>No artworkcards yet... start to add one.</p>
          <Link href="/add-artwork">Add a new artworkcard</Link>
        </>
      )}
      <ul>
        {artworkcards.map((artworkCard) => {
          const isBookmarked = bookmarkIds.includes(artworkCard._id);
          return (
            <li key={artworkCard._id}>
              <ArtworkCard
                artworkcard={artworkCard}
                isBookmarked={isBookmarked}
                onToggleBookmark={onToggleBookmark}
                onShowAnswer={onShowAnswer}
                showActions={showActions}
                onDelete={onDelete ?? handleDeleteResult}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}
