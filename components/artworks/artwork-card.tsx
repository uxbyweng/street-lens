"use client";

import Image from "next/image";
import Link from "next/link";
import { IconMapPinFilled } from "@tabler/icons-react";
import { LikeToggle } from "@/components/artworks/like-toggle";
import { Card } from "@/components/ui/card";
import type { Artwork } from "@/types/artwork";

type ArtworkCardProps = {
  artwork: Artwork & {
    likeCount?: number;
    isLiked?: boolean;
  };
  href: string;
  index: number;
  isLikedFilterActive?: boolean;
  onArtworkRemoved?: (artworkId: string) => void;
};

export function ArtworkCard({
  artwork,
  href,
  index,
  isLikedFilterActive = false,
  onArtworkRemoved,
}: ArtworkCardProps) {
  const shouldPreload = index < 3;
  const hasCoordinates = artwork.latitude != null && artwork.longitude != null;

  return (
    <Card className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden py-0 transition hover:shadow-md focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 focus-within:ring-offset-background">
      <div className="relative">
        <Link
          href={href}
          className="flex h-full flex-col focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <Image
            src={artwork.imageUrl ?? "/images/artwork-placeholder.jpg"}
            alt={`${artwork.title}${artwork.artist ? ` - ${artwork.artist}` : ""}`}
            width={800}
            height={450}
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            preload={shouldPreload}
            className="aspect-video w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-sky-900/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-end p-1">
            <div className="mb-3">
              {artwork.artist ? (
                <div className="block w-fit max-w-[85%] bg-black/70 px-2">
                  <p className="line-clamp-1 text-md font-semibold uppercase tracking-wide text-pink-500">
                    {artwork.artist}
                  </p>
                </div>
              ) : null}

              <div className="block w-fit max-w-[92%] bg-black/70 px-2">
                <p className="line-clamp-2 text-lg font-semibold leading-tight text-white">
                  {artwork.title}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/90">
              <LikeToggle
                artworkId={artwork._id}
                initialLiked={Boolean(artwork.isLiked)}
                initialLikeCount={artwork.likeCount ?? 0}
                refreshOnSuccess={isLikedFilterActive}
                onToggleSuccess={(nextLiked) => {
                  if (isLikedFilterActive && !nextLiked) {
                    onArtworkRemoved?.(artwork._id);
                  }
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-md px-1 py-1 transition disabled:opacity-60"
                likedIconClassName="size-5 fill-current text-pink-500"
                unlikedIconClassName="size-5 text-white hover:text-pink-500"
                countClassName="text-xs text-white/90"
              />

              {hasCoordinates ? (
                <div className="ml-3 inline-flex min-w-0 items-center gap-1">
                  <IconMapPinFilled className="size-3.5 shrink-0" />
                  <span className="truncate">
                    {artwork.latitude.toFixed(4)},{" "}
                    {artwork.longitude.toFixed(4)}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </Link>
      </div>
    </Card>
  );
}
