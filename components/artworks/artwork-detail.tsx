import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Artwork } from "@/types/artwork";

type ArtworkDetailProps = {
  artwork: Artwork;
};

export function ArtworkDetail({ artwork }: ArtworkDetailProps) {
  const hasCoordinates = artwork.latitude != null && artwork.longitude != null;

  return (
    <Card className="mx-auto flex w-full max-w-3xl flex-col overflow-hidden pt-0">
      <div className="relative">
        <Image
          src={artwork.imageUrl ?? "/images/artwork-placeholder.jpg"}
          alt={`${artwork.title}${artwork.author ? ` - ${artwork.author}` : ""}`}
          width={1200}
          height={675}
          className="aspect-video w-full object-cover"
        />
      </div>

      <CardHeader className="space-y-6">
        <div className="space-y-1">
          <CardTitle className="text-2xl sm:text-3xl">
            {artwork.title}
          </CardTitle>

          {artwork.author ? (
            <CardDescription className="text-sm sm:text-base">
              {artwork.author}
            </CardDescription>
          ) : null}
        </div>

        {artwork.description ? (
          <p className="text-sm leading-6 text-foreground sm:text-base">
            {artwork.description}
          </p>
        ) : null}

        {hasCoordinates ? (
          <div className="space-y-3">
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Location</p>
              <a
                className="link-primary"
                href={`https://www.google.com/maps?q=${artwork.latitude},${artwork.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {artwork.latitude.toFixed(4)}, {artwork.longitude.toFixed(4)}
              </a>
            </div>

            <div className="overflow-hidden rounded-xl border bg-muted">
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="text-base font-medium text-foreground">
                  Map preview
                </span>
                <span>
                  {artwork.latitude.toFixed(4)}, {artwork.longitude.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">User</p>
          <Link href="/users/maxi1973" className="link-primary">
            @maxi1973
          </Link>
        </div>

        {artwork.tags?.length ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Tags</p>
            <div className="flex flex-wrap gap-2">
              {artwork.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/artworks?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </CardHeader>
    </Card>
  );
}
