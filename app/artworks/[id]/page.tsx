import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { ArtworkDetail } from "@/components/artworks/artwork-detail";
import type { Metadata } from "next";
import { getArtworkById, getArtworkMetadataById } from "@/lib/data/artworks";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/mongodb";
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

  const image = artwork.imageUrl || "/images/og-default.jpg";
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
          url: image,
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
      images: [image],
    },
  };
}

export default async function ArtworkDetailPage({
  params,
}: ArtworkDetailPageProps) {
  const { id } = await params;
  const artwork = await getArtworkById(id);

  if (!artwork) {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id ?? null;

  await connectDB();

  const likeCount = await Like.countDocuments({ artworkId: id });

  const initialLiked =
    userId && mongoose.Types.ObjectId.isValid(userId)
      ? Boolean(
          await Like.exists({
            artworkId: id,
            userId,
          })
        )
      : false;

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://street-lens.vercel.app";

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
