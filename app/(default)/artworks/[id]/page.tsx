import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { ArtworkDetail } from "@/components/artworks/artwork-detail";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/mongodb";
import { Like } from "@/lib/models/like";
import { getArtworkById, getArtworkMetadataById } from "@/lib/data/artworks";

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

  return {
    title: `${artwork.title} by ${artwork.artist}`,
    description:
      artwork.description ?? `View details for ${artwork.title} on STREETLENS.`,
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

  return (
    <ArtworkDetail
      artwork={artwork}
      initialLikeCount={likeCount}
      initialLiked={initialLiked}
      isAuthenticated={Boolean(userId)}
    />
  );
}
