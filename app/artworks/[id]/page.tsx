import { notFound } from "next/navigation";
import { ArtworkDetail } from "@/components/artworks/artwork-detail";
import type { Metadata } from "next";
import { getArtworkById, getArtworkMetadataById } from "@/lib/data/artworks";

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

// Delay, um 'Loading' state zu testen
// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

export default async function ArtworkDetailPage({
  params,
}: ArtworkDetailPageProps) {
  const { id } = await params;
  const artwork = await getArtworkById(id);

  // Throw 'Error', um 'Error' state zu testen
  // throw new Error("Test error for artwork detail page");

  if (!artwork) {
    notFound();
  }

  return <ArtworkDetail artwork={artwork} />;
}
