import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Artwork } from "@/types/artwork";

type ArtworkCardProps = {
  artwork: Artwork;
  variant?: "preview" | "detail";
};

export function ArtworkCard({
  artwork,
  variant = "preview",
}: ArtworkCardProps) {
  const isDetail = variant === "detail";

  return (
    <Card className="mx-auto w-full max-w-sm overflow-hidden pt-0">
      <Image
        src={artwork.imageUrl ?? "/images/artwork-placeholder.jpg"}
        alt={`${artwork.title}${artwork.author ? ` - ${artwork.author}` : ""}`}
        width={800}
        height={450}
        className="aspect-video w-full object-cover"
      />

      <CardHeader>
        <CardTitle>{artwork.title}</CardTitle>

        {artwork.author ? (
          <CardDescription>{artwork.author}</CardDescription>
        ) : null}

        {isDetail ? (
          <CardDescription>{artwork.description}</CardDescription>
        ) : null}

        {isDetail && artwork.latitude && artwork.longitude ? (
          <div className="text-sm text-muted-foreground">
            <p>Latitude: {artwork.latitude}</p>
            <p>Longitude: {artwork.longitude}</p>
          </div>
        ) : null}

        {isDetail && artwork.tags?.length ? (
          <p className="text-sm text-muted-foreground">
            {artwork.tags.join(", ")}
          </p>
        ) : null}
      </CardHeader>

      {/* Button auf Detailansicht ausblenden */}
      {!isDetail ? (
        <CardFooter>
          <Button className="w-full">View details</Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
