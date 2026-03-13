import { NewArtworkForm } from "@/components/forms/new-artwork-form";
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

      <section className="mx-auto mt-8 max-w-6xl">
        <NewArtworkForm />
      </section>
    </>
  );
}
