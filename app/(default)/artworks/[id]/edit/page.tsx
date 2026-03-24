import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
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

  const session = await auth();

  if (!session?.user) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="mt-2 text-muted-foreground">
          You need to sign in to access this page.
        </p>
      </section>
    );
  }

  if (session.user.role !== "admin") {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="mt-2 text-muted-foreground">
          Only admins can edit artworks.
        </p>
      </section>
    );
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
