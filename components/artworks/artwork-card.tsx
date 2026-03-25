import Image from "next/image";
import Link from "next/link";
import { IconHeart, IconMapPinFilled } from "@tabler/icons-react";

import { Card } from "@/components/ui/card";
import type { Artwork } from "@/types/artwork";

type ArtworkCardProps = {
  artwork: Artwork & {
    likeCount?: number;
  };
  href: string;
  index: number;
};

export function ArtworkCard({ artwork, href, index }: ArtworkCardProps) {
  const shouldPreload = index < 3;

  const hasCoordinates = artwork.latitude != null && artwork.longitude != null;

  return (
    <Card className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden py-0 transition hover:shadow-md">
      <Link
        href={href}
        className="flex h-full flex-col focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <div className="relative">
          <Image
            src={artwork.imageUrl ?? "/images/artwork-placeholder.jpg"}
            alt={`${artwork.title}${artwork.artist ? ` - ${artwork.artist}` : ""}`}
            width={800}
            height={450}
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            preload={shouldPreload}
            className="aspect-video w-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-end p-1">
            <div className="mb-1 space-y-1">
              {artwork.artist ? (
                <div className="block w-fit max-w-[85%] bg-black/70 px-2 py-1">
                  <p className="line-clamp-1 text-lg font-semibold uppercase tracking-wide text-pink-500">
                    {artwork.artist}
                  </p>
                </div>
              ) : null}

              <div className="block w-fit max-w-[92%] bg-black/70 px-2 py-1">
                <p className="line-clamp-2 text-lg font-semibold leading-tight text-white">
                  {artwork.title}
                </p>
              </div>
            </div>

            <div className="flex items-end justify-between text-xs">
              <div className="min-w-0">
                {hasCoordinates ? (
                  <div className="flex items-center gap-1 text-white/90">
                    <IconMapPinFilled className="size-3.5 shrink-0" />
                    <span className="truncate">
                      {artwork.latitude.toFixed(4)},{" "}
                      {artwork.longitude.toFixed(4)}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="ml-3 flex shrink-0 items-center gap-1 text-white/90">
                <IconHeart className="size-4" />
                <span>{artwork.likeCount ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
