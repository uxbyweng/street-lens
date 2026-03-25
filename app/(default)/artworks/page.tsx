import Link from "next/link";
import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { ArtworkList } from "@/components/artworks/artwork-list";
import { getArtworks } from "@/lib/data/artworks";
import { PageIntro } from "@/components/layout/page-intro";
import { Like } from "@/lib/models/like";
import { Artwork } from "@/lib/models/artwork";

type ArtworksPageProps = {
  searchParams: Promise<{
    liked?: string;
  }>;
};

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

  let artworks = [];

  if (liked && session?.user?.id) {
    const likes = await Like.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const artworkIds = likes.map((like) => like.artworkId);

    artworks = await Artwork.find({
      _id: { $in: artworkIds },
    }).lean();

    const likeCounts = await Like.aggregate([
      {
        $match: {
          artworkId: { $in: artworkIds },
        },
      },
      {
        $group: {
          _id: "$artworkId",
          count: { $sum: 1 },
        },
      },
    ]);

    const likeCountMap = new Map(
      likeCounts.map((entry) => [entry._id.toString(), entry.count])
    );

    artworks = artworks.map((artwork) => ({
      ...artwork,
      likeCount: likeCountMap.get(artwork._id.toString()) ?? 0,
    }));
  } else {
    artworks = await getArtworks();
  }

  const pageTitle = "Artworks";
  const pageSubtitle = "Discover interesting artworks.";

  return (
    <>
      <PageIntro
        title={pageTitle}
        subtitle={pageSubtitle}
        className="max-w-6xl"
      />

      <section className="mx-auto mt-6 max-w-6xl px-4">
        <div className="flex flex-wrap gap-3">
          <Link
            href={liked ? "/artworks" : "/artworks?liked=true"}
            className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
              liked
                ? "bg-foreground text-background"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            Liked by me
          </Link>
        </div>
      </section>

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
