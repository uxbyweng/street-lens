import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArtworkForm } from "@/components/forms/artwork-form";
import { PageIntro } from "@/components/layout/page-intro";
import { getArtworkById } from "@/lib/data/artworks";

type EditArtworkPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: EditArtworkPageProps): Promise<Metadata> {
  const { id } = await params;
  const artwork = await getArtworkById(id);

  if (!artwork) {
    return {
      title: "Artwork not found",
      description: "The requested artwork could not be found.",
    };
  }

  return {
    title: `Edit ${artwork.title}`,
    description: `Edit details for ${artwork.title} by ${artwork.artist}.`,
  };
}

export default async function EditArtworkPage({
  params,
}: EditArtworkPageProps) {
  const { id } = await params;
  const artwork = await getArtworkById(id);

  if (!artwork) {
    notFound();
  }

  return (
    <>
      <PageIntro
        title="Edit artwork"
        subtitle="Update the artwork details below."
        className="max-w-6xl"
      />

      <section className="mx-auto mt-8 max-w-6xl">
        <ArtworkForm
          mode="edit"
          artworkId={artwork._id}
          initialValues={{
            title: artwork.title,
            artist: artwork.artist ?? "",
            description: artwork.description,
            imageUrl: artwork.imageUrl ?? "",
            latitude:
              artwork.latitude !== undefined ? String(artwork.latitude) : "",
            longitude:
              artwork.longitude !== undefined ? String(artwork.longitude) : "",
            tags: artwork.tags?.join(", ") ?? "",
          }}
        />
      </section>
    </>
  );
}
