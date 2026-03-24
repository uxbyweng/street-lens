import Link from "next/link";
import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { ArtworkList } from "@/components/artworks/artwork-list";
import { getArtworks } from "@/lib/data/artworks";
import { PageIntro } from "@/components/layout/page-intro";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artworks",
  description: "Browse all saved artworks in STREETLENS.",
};

export default async function ArtworksPage() {
  const session = await auth();
  const artworks = await getArtworks();

  const isAdmin = session?.user?.role === "admin";

  return (
    <>
      <PageIntro
        title="Artworks"
        subtitle="Overview of all available artworks to quickly discover interesting artworks."
        className="max-w-6xl"
      />

      <section className="mx-auto my-8 max-w-6xl px-4">
        <ArtworkList artworks={artworks} />
      </section>

      {isAdmin ? (
        <Link
          href="/artworks/new"
          aria-label="Add artwork"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-sky-700"
        >
          <Plus className="h-10 w-10" />
        </Link>
      ) : null}
    </>
  );
}
