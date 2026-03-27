"use client";

import { useState } from "react";
import { ArtworkList } from "@/components/artworks/artwork-list";
import { Button } from "@/components/ui/button";
import type { Artwork } from "@/types/artwork";

type ArtworkListItem = Artwork & {
  likeCount?: number;
  isLiked?: boolean;
};

type ArtworkListLoadMoreProps = {
  initialArtworks: ArtworkListItem[];
  isLikedFilterActive?: boolean;
  initialPage?: number;
  pageSize?: number;
};

export function ArtworkListLoadMore({
  initialArtworks,
  isLikedFilterActive = false,
  initialPage = 1,
  pageSize = 15,
}: ArtworkListLoadMoreProps) {
  const [artworks, setArtworks] = useState<ArtworkListItem[]>(initialArtworks);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialArtworks.length === pageSize);

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
        isLikedFilterActive={isLikedFilterActive}
        onArtworkRemoved={handleArtworkRemoved}
      />

      {hasMore ? (
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoading}
            className="cursor-pointer rounded-full px-6"
          >
            {isLoading ? "Loading..." : "Load more artworks"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
