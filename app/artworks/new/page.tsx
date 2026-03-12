import { NewArtworkForm } from "@/components/forms/new-artwork-form";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Add artwork",
  description: "Add a new artwork to your STREETLENS collection.",
};

export default function NewArtworkPage() {
  return (
    <>
      <section className="mx-auto rounded-2xl border p-6 max-w-6xl">
        <h1 className="text-2xl font-semibold">Add new artwork</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Fill in the details below to save a new artwork.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-6xl">
        <NewArtworkForm />
      </section>
    </>
  );
}
