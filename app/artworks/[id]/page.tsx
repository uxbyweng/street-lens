import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { ArtworkDetail } from "@/components/artworks/artwork-detail";
import type { Metadata } from "next";
import { getArtworkById, getArtworkMetadataById } from "@/lib/data/artworks";
import { auth } from "@/auth";
import { Like } from "@/lib/models/like";

export const dynamic = "force-dynamic";

type ArtworkDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: ArtworkDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const artwork = await getArtworkMetadataById(id);

  if (!artwork) {
    return {
      title: "Artwork not found",
      description: "The requested artwork could not be found.",
    };
  }

  const title = `${artwork.title} by ${artwork.artist}`;
  const description =
    artwork.description?.trim() ||
    `View details for ${artwork.title} on STREET LENS.`;

  const ogImage = artwork.imageUrl?.includes("res.cloudinary.com")
    ? artwork.imageUrl.replace(
        "/upload/",
        "/upload/w_1200,h_630,c_fill,g_auto,q_auto,f_auto/"
      )
    : artwork.imageUrl || "/images/og-default.jpg";
  const url = `/artworks/${artwork._id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "STREET LENS",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: artwork.title || "Artwork preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ArtworkDetailPage({
  params,
}: ArtworkDetailPageProps) {
  const { id } = await params;

  // Artwork-Daten und Session parallel laden
  const [artwork, session] = await Promise.all([getArtworkById(id), auth()]);

  if (!artwork) {
    notFound();
  }

  const userId = session?.user?.id ?? null;

  // Like-Daten parallel laden (connectDB ist bereits durch getArtworkById passiert)
  const [likeCount, likeExists] = await Promise.all([
    Like.countDocuments({ artworkId: id }),
    userId && mongoose.Types.ObjectId.isValid(userId)
      ? Like.exists({ artworkId: id, userId })
      : null,
  ]);

  const initialLiked = Boolean(likeExists);

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.berlin-street-view.de/";

  const description = artwork.description
    ? artwork.description.slice(0, 300)
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title,
    artist: {
      "@type": "Person",
      name: artwork.artist,
    },
    description,
    image: artwork.imageUrl || undefined,
    url: `${baseUrl}/artworks/${artwork._id}`,
    material: artwork.tags?.length ? artwork.tags.join(", ") : undefined,
    artform: "Street Art",
    ...(artwork.latitude != null && artwork.longitude != null
      ? {
          contentLocation: {
            "@type": "Place",
            name: "Berlin",
            geo: {
              "@type": "GeoCoordinates",
              latitude: artwork.latitude,
              longitude: artwork.longitude,
            },
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArtworkDetail
        artwork={artwork}
        initialLikeCount={likeCount}
        initialLiked={initialLiked}
        isAuthenticated={Boolean(userId)}
      />
    </>
  );
}
