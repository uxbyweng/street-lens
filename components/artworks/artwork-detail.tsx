import Link from "next/link";
import { ArtworkImageViewer } from "@/components/artworks/artwork-image-viewer";
import { MapPicker } from "@/components/map/map-picker";
import { TextLink } from "@/components/ui/text-link";
import { Button } from "@/components/ui/button";
import { IconLocation } from "@tabler/icons-react";
import { DeleteArtworkButton } from "@/components/artworks/delete-artwork-button";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import type { Artwork } from "@/types/artwork";

type ArtworkDetailProps = {
  artwork: Artwork;
};

export function ArtworkDetail({ artwork }: ArtworkDetailProps) {
  const hasCoordinates = artwork.latitude != null && artwork.longitude != null;
  const hasCreatedAt = artwork.createdAt != null;
  const hasUpdatedAt = artwork.updatedAt != null;

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("en-GB");
  }

  return (
    <>
      <ArtworkImageViewer
        src={artwork.imageUrl ?? "/images/placeholder.jpg"}
        alt={`${artwork.title}${artwork.artist ? ` - ${artwork.artist}` : ""}`}
      />
      <Card className="mx-auto w-full max-w-3xl overflow-hidden pt-8 border-0 rounded-none bg-background">
        <CardHeader className="space-y-2">
          <CardTitle className="font-fjalla text-3xl sm:text-4xl">
            {artwork.title}
          </CardTitle>

          {artwork.artist ? (
            <CardDescription className="font-fjalla text-pink-600 text-xl sm:2xl">
              {artwork.artist}
            </CardDescription>
          ) : null}
        </CardHeader>

        <div className="space-y-6 px-6 pb-6">
          {artwork.description ? (
            <p className="text-sm leading-6 text-foreground sm:text-base">
              {artwork.description}
            </p>
          ) : null}

          {hasCoordinates ? (
            <div className="space-y-3">
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  Location: {artwork.latitude}, {artwork.longitude}
                </p>
              </div>

              <MapPicker
                latitude={artwork.latitude}
                longitude={artwork.longitude}
                disabled={true}
                showControls={true}
              />
              <Button asChild>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${artwork.latitude},${artwork.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Navigate to Artwork
                  <IconLocation className="size-4" />
                </a>
              </Button>
            </div>
          ) : null}

          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">User</p>
            <TextLink href="/users/maxi1973">@maxi1973</TextLink>
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

          <div className="grid gap-4 sm:grid-cols-2">
            {hasCreatedAt ? (
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Date created</p>
                <p className="text-xs">{formatDate(artwork.createdAt!)}</p>
              </div>
            ) : null}

            {hasUpdatedAt ? (
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Last updated</p>
                <p className="text-xs">{formatDate(artwork.updatedAt!)}</p>
              </div>
            ) : null}
          </div>
        </div>

        <CardFooter className="border-t px-6 py-4">
          <DeleteArtworkButton
            artworkId={artwork._id}
            artworkTitle={artwork.title}
          />
        </CardFooter>
      </Card>
    </>
  );
}
