import { AppShell } from "@/components/layout/app-shell";
import { NewArtworkForm } from "@/components/forms/new-artwork-form";

export default function NewArtworkPage() {
  return (
    <AppShell>
      <section className="mx-auto rounded-2xl border p-6 max-w-6xl">
        <h1 className="text-2xl font-semibold">Add new artwork</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Save a new artwork to your collection.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-6xl">
        <NewArtworkForm />
      </section>
    </AppShell>
  );
}
