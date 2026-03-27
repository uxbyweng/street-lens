import Link from "next/link";
import type { Metadata } from "next";
import { IconPlus } from "@tabler/icons-react";
import { auth } from "@/auth";
import { getArtworksForOverview } from "@/lib/data/artworks";
import { PageIntro } from "@/components/layout/page-intro";
import { ArtworkListLoadMore } from "@/components/artworks/artwork-list-load-more";

type ArtworksPageProps = {
  searchParams: Promise<{
    liked?: string;
  }>;
};

const ARTWORKS_PAGE_SIZE = 15;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artworks",
  description: "Browse all saved artworks in STREETLENS.",
};

export default async function ArtworksPage({
  searchParams,
}: ArtworksPageProps) {
  const session = await auth();
  const params = await searchParams;

  const liked = params?.liked === "true";
  const isAdmin = session?.user?.role === "admin";

  const artworks = await getArtworksForOverview({
    userId: session?.user?.id,
    likedOnly: liked,
    page: 1,
    limit: ARTWORKS_PAGE_SIZE,
  });

  return (
    <>
      <PageIntro
        title="Artworks"
        subtitle="Not every gallery has opening hours. Some just happen to be on your way."
        bgImage="/images/stage_artworks.jpg"
        className="font-fjalla rounded-none h-50 text-black sm:px-5 md:px-10 lg:h-80 lg:px-40 lg:py-15"
      />

      {session?.user ? (
        <section className="mx-auto mt-6 max-w-6xl px-4">
          <div className="flex flex-wrap gap-3">
            <Link
              href={liked ? "/artworks" : "/artworks?liked=true"}
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                liked
                  ? "bg-foreground text-background"
                  : "border-border bg-gray-800 text-foreground hover:bg-muted"
              }`}
            >
              Liked by me
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mx-auto my-8 max-w-6xl px-4">
        <ArtworkListLoadMore
          key={liked ? "liked" : "all"}
          initialArtworks={artworks}
          isLikedFilterActive={liked}
          initialPage={1}
          pageSize={ARTWORKS_PAGE_SIZE}
        />
      </section>

      {isAdmin ? (
        <Link
          href="/artworks/new"
          aria-label="Add artwork"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-sky-700"
        >
          <IconPlus size={30} stroke={3} className="h-10 w-10" />
        </Link>
      ) : null}
    </>
  );
}
