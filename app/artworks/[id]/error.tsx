"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ArtworkDetailErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  console.error(error);

  return (
    <>
      <section className="mx-auto max-w-3xl rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold">Artwork details</h1>
        <p
          role="alert"
          className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
        >
          Error loading artwork. Please try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-4 rounded-full border px-4 py-2 text-sm font-medium"
        >
          Try again
        </button>
      </section>
    </>
  );
}
