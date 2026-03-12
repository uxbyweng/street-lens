import { TextLink } from "@/components/ui/text-link";

export default function ArtworkNotFound() {
  return (
    <>
      <section className="mx-auto max-w-3xl rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold">Artwork not found</h1>
        <p
          role="status"
          aria-live="polite"
          className="my-4 rounded-2xl border bg-muted p-4 text-sm text-muted-foreground"
        >
          The requested artwork does not exist.
        </p>
        <TextLink href="/artworks">Back to artworks</TextLink>
      </section>
    </>
  );
}
