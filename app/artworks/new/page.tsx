import type { Metadata } from "next";
import { auth } from "@/auth";
import { ArtworkForm } from "@/components/forms/artwork-form";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = {
  title: "Add artwork",
  description: "Add new artwork to STREETLENS collection.",
};

export default async function NewArtworkPage() {
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
          Only admins can create artworks.
        </p>
      </section>
    );
  }

  return (
    <>
      <PageIntro
        title="Add new artwork"
        subtitle="Fill in the details below to save a new artwork."
        bgImage="/images/stage_add-artwork.jpg"
        className="font-fjalla rounded-none h-50 lg:h-80 sm:px-5 md:px-10 lg:px-40 lg:py-15 text-black"
      />

      <section className="mx-auto mt-8 max-w-6xl">
        <ArtworkForm mode="create" />
      </section>
    </>
  );
}
