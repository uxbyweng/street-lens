import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardDescription,
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
                  📍 {artwork.latitude.toFixed(4)},{" "}
                  {artwork.longitude.toFixed(4)}
                </p>
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
            <p className="py-2 text-sm text-foreground">
              {artwork.description}
            </p>
          ) : null}

          {artwork.latitude != null && artwork.longitude != null ? (
            <p className="text-xs text-muted-foreground">
              Location:{" "}
              <a
                className="link-primary"
                href={`https://www.google.com/maps?q=${artwork.latitude},${artwork.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {artwork.latitude.toFixed(4)}, {artwork.longitude.toFixed(4)}
              </a>
            </p>
          ) : null}

          <p className="text-xs text-muted-foreground">
            User:{" "}
            <Link href="/users/maxi1973" className="link-primary">
              @maxi1973
            </Link>
          </p>

          {artwork.tags?.length ? (
            <div className="space-y-2 pt-2">
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
      ) : null}
    </>
  );

  //  Verlinkung der Card nur im 'preview' mode
  if (!isDetail && href) {
    return (
      <Card className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden py-0 transition hover:shadow-md">
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
