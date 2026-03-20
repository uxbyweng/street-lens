export default function ArtworkDetailLoading() {
  return (
    <section className="mx-auto max-w-3xl rounded-2xl border p-6">
      <h1 className="text-2xl font-semibold">Artwork details</h1>
      <p
        role="status"
        aria-live="polite"
        className="mt-4 rounded-2xl border bg-muted p-4 text-sm text-muted-foreground"
      >
        Loading artwork details...
      </p>
    </section>
  );
}
