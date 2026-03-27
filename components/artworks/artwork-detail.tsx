import Link from "next/link";
import { auth } from "@/auth";
import { ArtworkImageViewer } from "@/components/artworks/artwork-image-viewer";
import { LikeToggle } from "@/components/artworks/like-toggle";
import { MapPicker } from "@/components/map/map-picker";
import { Button } from "@/components/ui/button";
import { IconLocation } from "@tabler/icons-react";
import { DeleteArtworkButton } from "@/components/artworks/delete-artwork-button";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Artwork } from "@/types/artwork";

type ArtworkDetailProps = {
  artwork: Artwork;
  initialLikeCount: number;
  initialLiked: boolean;
  isAuthenticated: boolean;
};

export async function ArtworkDetail({
  artwork,
  initialLikeCount,
  initialLiked,
  isAuthenticated,
}: ArtworkDetailProps) {
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

      <Card className="mx-auto w-full max-w-6xl rounded-none border-0 bg-background px-6 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-2">
              <CardTitle className="font-fjalla text-4xl sm:text-6xl">
                {artwork.title}
              </CardTitle>

              {artwork.artist ? (
                <CardDescription className="font-fjalla text-2xl text-pink-600 sm:text-4xl">
                  {artwork.artist}
                </CardDescription>
              ) : null}
            </div>

            {artwork.description ? (
              <p className="whitespace-pre-line max-w-3xl text-lg leading-relaxed text-foreground sm:text-xl">
                {artwork.description}
              </p>
            ) : null}
          </div>

          {/* Right column */}
          <div className="space-y-6 lg:col-span-1">
            <LikeToggle
              artworkId={artwork._id}
              initialLiked={initialLiked}
              initialLikeCount={initialLikeCount}
              isAuthenticated={isAuthenticated}
              className="flex cursor-pointer items-center gap-2 px-1 py-1"
              likedIconClassName="size-6 fill-current text-pink-500"
              unlikedIconClassName="size-6 text-foreground hover:text-pink-500"
              countClassName="text-base font-medium text-foreground"
            />

            {hasCoordinates ? (
              <div className="space-y-4">
                <MapPicker
                  latitude={artwork.latitude}
                  longitude={artwork.longitude}
                  disabled={true}
                  showControls={true}
                />

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>
                    Lat. {artwork.latitude}, Long. {artwork.longitude}
                  </p>
                </div>

                <Button asChild className="w-full">
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
                <div className="flex flex-wrap gap-3">
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

            {isAdmin ? (
              <div className="space-y-4 border-t pt-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {hasCreatedAt ? (
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">
                        Date created
                      </p>
                      <p className="text-xs">
                        {formatDate(artwork.createdAt!)}
                      </p>
                    </div>
                  ) : null}

                  {hasUpdatedAt ? (
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">
                        Last updated
                      </p>
                      <p className="text-xs">
                        {formatDate(artwork.updatedAt!)}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap  border-t  pt-4 gap-3">
                  <DeleteArtworkButton
                    artworkId={artwork._id}
                    artworkTitle={artwork.title}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </>
  );
}
