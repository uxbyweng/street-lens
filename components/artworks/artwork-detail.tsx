import Link from "next/link";
import { auth } from "@/auth";
import { ArtworkImageViewer } from "@/components/artworks/artwork-image-viewer";
import { MapPicker } from "@/components/map/map-picker";
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

export async function ArtworkDetail({ artwork }: ArtworkDetailProps) {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

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
      <Card className="mx-auto w-full max-w-3xl overflow-hidden border-0 rounded-none bg-background pt-8">
        <CardHeader className="space-y-2">
          <CardTitle className="font-fjalla text-4xl sm:text-6xl">
            {artwork.title}
          </CardTitle>

          {artwork.artist ? (
            <CardDescription className="font-fjalla text-2xl text-pink-600 sm:text-4xl">
              {artwork.artist}
            </CardDescription>
          ) : null}
        </CardHeader>

        <div className="space-y-6 px-6 pb-6">
          {artwork.description ? (
            <p className="text-xl text-foreground">{artwork.description}</p>
          ) : null}

          {hasCoordinates ? (
            <div className="space-y-3">
              <MapPicker
                latitude={artwork.latitude}
                longitude={artwork.longitude}
                disabled={true}
                showControls={true}
              />
              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="text-muted-foreground">
                  Lat. {artwork.latitude}, Long. {artwork.longitude}
                </p>
              </div>
              <Button asChild>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${artwork.latitude},${artwork.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-sky-800"
                >
                  Navigate to Artwork
                  <IconLocation className="size-4" />
                </a>
              </Button>
            </div>
          ) : null}

          {artwork.tags?.length ? (
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">Tags</p>
              <div className="flex flex-wrap gap-4">
                {artwork.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/artworks?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-full border bg-pink-400/30 px-3 py-1 text-xs text-muted-foreground transition hover:bg-orange-500/50 hover:text-foreground"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {isAdmin ? (
          <CardFooter className="border-t px-6 py-4">
            <div className="grid gap-5 sm:grid-cols-4">
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

              <DeleteArtworkButton
                artworkId={artwork._id}
                artworkTitle={artwork.title}
              />
            </div>
          </CardFooter>
        ) : null}
      </Card>
    </>
  );
}
