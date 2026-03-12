import { notFound } from "next/navigation";
import { ArtworkDetail } from "@/components/artworks/artwork-detail";
import type { Metadata } from "next";
import { getArtworks } from "@/lib/data/artworks";

type ArtworkDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: ArtworkDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const artworks = await getArtworks();
  const artwork = artworks.find((item) => item._id === id);

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

  // Throw 'Error', um 'Error' state zu testen
  // throw new Error("Test error for artwork detail page");

  const artworks = await getArtworks();
  const artwork = artworks.find((item) => item._id === id);

  if (!artwork) {
    notFound();
  }

  return <ArtworkDetail artwork={artwork} />;
}
