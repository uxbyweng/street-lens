import { notFound } from "next/navigation";
import { ArtworkDetail } from "@/components/artworks/artwork-detail";
import type { Metadata } from "next";
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

  return <ArtworkDetail artwork={artwork} />;
}
