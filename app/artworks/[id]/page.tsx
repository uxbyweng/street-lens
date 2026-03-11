import { notFound } from "next/navigation";
import { ArtworkDetail } from "@/components/artworks/artwork-detail";
import { AppShell } from "@/components/layout/app-shell";
import { getArtworks } from "@/lib/data/artworks";

type ArtworkDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ArtworkDetailPage({
  params,
}: ArtworkDetailPageProps) {
  const { id } = await params;

  const artworks = await getArtworks();
  const artwork = artworks.find((item) => item._id === id);

  if (!artwork) {
    notFound();
  }

  return (
    <AppShell>
      <ArtworkDetail artwork={artwork} />
    </AppShell>
  );
}
