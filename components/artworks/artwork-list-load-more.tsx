"use client";

import { useEffect, useState } from "react";
import { ArtworkList } from "@/components/artworks/artwork-list";
import { Button } from "@/components/ui/button";
import type { Artwork } from "@/types/artwork";
import { isLocallyLiked } from "@/lib/likes/local-storage";

type ArtworkListItem = Artwork & {
  likeCount?: number;
  isLiked?: boolean;
};

type ArtworkListLoadMoreProps = {
  initialArtworks: ArtworkListItem[];
  isAuthenticated?: boolean;
  isLikedFilterActive?: boolean;
  initialPage?: number;
  pageSize?: number;
};

export function ArtworkListLoadMore({
  initialArtworks,
  isAuthenticated,
  isLikedFilterActive = false,
  initialPage = 1,
  pageSize = 15,
}: ArtworkListLoadMoreProps) {
  // Client-seitige Filterung nach localStorage-Likes für nicht eingeloggte User
  const isLocalLikedFilter = isLikedFilterActive && !isAuthenticated;

  const [artworks, setArtworks] = useState<ArtworkListItem[]>(initialArtworks);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    !isLocalLikedFilter && initialArtworks.length === pageSize
  );

  // Lokale Likes filtern (erst nach Mount, da localStorage auf dem Server nicht verfügbar ist)
  useEffect(() => {
    if (isLocalLikedFilter) {
      setArtworks(initialArtworks.filter((a) => isLocallyLiked(a._id)));
    }
  }, [isLocalLikedFilter, initialArtworks]);

  function handleArtworkRemoved(artworkId: string) {
    setArtworks((current) =>
      current.filter((artwork) => artwork._id !== artworkId)
    );
  }

  async function handleLoadMore() {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const nextPage = page + 1;
      const query = new URLSearchParams({
        page: String(nextPage),
        limit: String(pageSize),
      });

      if (isLikedFilterActive) {
        query.set("liked", "true");
      }

      const response = await fetch(`/api/artworks?${query.toString()}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to load more artworks.");
      }

      const nextArtworks: ArtworkListItem[] = Array.isArray(result?.data)
        ? result.data
        : [];

      setArtworks((current) => [...current, ...nextArtworks]);
      setPage(nextPage);
      setHasMore(nextArtworks.length === pageSize);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <ArtworkList
        artworks={artworks}
        isAuthenticated={isAuthenticated}
        isLikedFilterActive={isLikedFilterActive}
        onArtworkRemoved={handleArtworkRemoved}
      />

      {hasMore ? (
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoading}
            className="group inline-flex items-center gap-2 px-8 py-6 text-xl sm:px-10 sm:py-5 sm:text-1xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {isLoading ? "Loading..." : "Load more artworks"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
