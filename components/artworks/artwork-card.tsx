import Image from "next/image";
import Link from "next/link";
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
  href?: string;
  variant?: "preview" | "detail";
};

export function ArtworkCard({
  artwork,
  href,
  variant = "preview",
}: ArtworkCardProps) {
  const isDetail = variant === "detail";

  const cardContent = (
    <>
      <div className="relative">
        <Image
          src={artwork.imageUrl ?? "/images/artwork-placeholder.jpg"}
          alt={`${artwork.title}${artwork.author ? ` - ${artwork.author}` : ""}`}
          width={800}
          height={450}
          className="aspect-video w-full object-cover"
        />

        {!isDetail ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <CardTitle className="line-clamp-2 text-lg text-white">
                {artwork.title}
              </CardTitle>

              {artwork.author ? (
                <CardDescription className="text-white/90">
                  {artwork.author}
                </CardDescription>
              ) : null}

              {artwork.latitude && artwork.longitude ? (
                <div className="text-sm text-white/80">
                  <p>Latitude: {artwork.latitude}</p>
                  <p>Longitude: {artwork.longitude}</p>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>

      {isDetail ? (
        <CardHeader>
          <CardTitle>{artwork.title}</CardTitle>

          {artwork.author ? (
            <CardDescription>{artwork.author}</CardDescription>
          ) : null}

          {artwork.description ? (
            <CardDescription>{artwork.description}</CardDescription>
          ) : null}

          {artwork.latitude && artwork.longitude ? (
            <div className="text-sm text-muted-foreground">
              <p>Latitude: {artwork.latitude}</p>
              <p>Longitude: {artwork.longitude}</p>
            </div>
          ) : null}

          {artwork.tags?.length ? (
            <p className="text-sm text-muted-foreground">
              {artwork.tags.join(", ")}
            </p>
          ) : null}

          <CardFooter>Username</CardFooter>
        </CardHeader>
      ) : null}
    </>
  );

  //  Verlinkung der Card nur im 'preview' mode
  if (!isDetail && href) {
    return (
      <Card className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden pt-0 py-0 transition hover:shadow-md">
        <Link
          href={href}
          className="flex h-full flex-col focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {cardContent}
        </Link>
      </Card>
    );
  }

  return (
    <Card className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden pt-0">
      {cardContent}
    </Card>
  );
}
