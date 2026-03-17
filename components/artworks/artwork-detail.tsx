import Image from "next/image";
import Link from "next/link";
import { MapPicker } from "@/components/map/map-picker";
import { TextLink } from "@/components/ui/text-link";
import { DeleteArtworkButton } from "@/components/artworks/delete-artwork-button";

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
  const hasCreatedAt = artwork.createdAt != null;
  const hasUpdatedAt = artwork.updatedAt != null;

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("en-GB");
  }

  return (
    <Card className="mx-auto flex w-full max-w-3xl flex-col overflow-hidden pt-0">
      <div className="relative">
        <Image
          src={artwork.imageUrl ?? "/images/artwork-placeholder.jpg"}
          alt={`${artwork.title}${artwork.artist ? ` - ${artwork.artist}` : ""}`}
          width={1200}
          height={675}
          className="aspect-video w-full object-cover"
        />
      </div>

      <div className="px-6 py-0">
        <DeleteArtworkButton
          artworkId={artwork._id}
          artworkTitle={artwork.title}
        />
      </div>

      <CardHeader className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl sm:text-3xl">
              {artwork.title}
            </CardTitle>

            {artwork.artist ? (
              <CardDescription className="text-sm sm:text-base">
                {artwork.artist}
              </CardDescription>
            ) : null}
          </div>
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
              <TextLink
                href={`https://www.google.com/maps?q=${artwork.latitude},${artwork.longitude}`}
                target="_blank"
              >
                {artwork.latitude.toFixed(4)}, {artwork.longitude.toFixed(4)}
              </TextLink>
            </div>

            <div className="overflow-hidden rounded-xl border">
              <MapPicker
                latitude={artwork.latitude}
                longitude={artwork.longitude}
                disabled={true}
                showControls={false}
                className="aspect-video"
              />
            </div>
          </div>
        ) : null}

        {/* // PLACEHOLDER -> User Handling kommt später -> tbd. */}
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
      </CardHeader>
    </Card>
  );
}
