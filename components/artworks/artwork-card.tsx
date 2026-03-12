import Image from "next/image";
import Link from "next/link";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Artwork } from "@/types/artwork";

type ArtworkCardProps = {
  artwork: Artwork;
  href: string;
};

export function ArtworkCard({ artwork, href }: ArtworkCardProps) {
  return (
    <Card className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden py-0 transition hover:shadow-md">
      <Link
        href={href}
        className="flex h-full flex-col focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <div className="relative">
          <Image
            src={artwork.imageUrl ?? "/images/artwork-placeholder.jpg"}
            alt={`${artwork.title}${artwork.author ? ` - ${artwork.author}` : ""}`}
            width={800}
            height={450}
            className="aspect-video w-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <CardTitle className="line-clamp-1 text-lg text-white">
              {artwork.title}
            </CardTitle>

            {artwork.author ? (
              <CardDescription className="line-clamp-1 text-white/80">
                {artwork.author}
              </CardDescription>
            ) : null}

            {artwork.latitude != null && artwork.longitude != null ? (
              <p className="text-xs text-white/80">
                📍 {artwork.latitude.toFixed(4)}, {artwork.longitude.toFixed(4)}
              </p>
            ) : null}
          </div>
        </div>
      </Link>
    </Card>
  );
}
