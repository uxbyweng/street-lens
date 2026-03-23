import { ArtworkForm } from "@/components/forms/artwork-form";
import { PageIntro } from "@/components/layout/page-intro";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add artwork",
  description: "Add a new artwork to your STREETLENS collection.",
};

export default function NewArtworkPage() {
  return (
    <>
      <PageIntro
        title="Add new artwork"
        subtitle="Fill in the details below to save a new artwork."
        className="max-w-6xl"
      />

      <section className="mx-auto max-w-4xl my-8 px-4">
        <ArtworkForm mode="create" />
      </section>
    </>
  );
}
