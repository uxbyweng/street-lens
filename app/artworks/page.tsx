import Link from "next/link";
import type { Metadata } from "next";
import { IconPlus } from "@tabler/icons-react";
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

function serializeArtwork(artwork: any) {
  return {
    _id: artwork._id.toString(),
    title: artwork.title,
    artist: artwork.artist,
    description: artwork.description,
    imageUrl: artwork.imageUrl ?? "",
    cloudinaryPublicId: artwork.cloudinaryPublicId ?? "",
    latitude: artwork.latitude ?? null,
    longitude: artwork.longitude ?? null,
    tags: Array.isArray(artwork.tags) ? artwork.tags : [],
    owner: artwork.owner?.toString?.() ?? "",
    createdAt: artwork.createdAt?.toISOString?.() ?? "",
    updatedAt: artwork.updatedAt?.toISOString?.() ?? "",
    likeCount: artwork.likeCount ?? 0,
    isLiked: Boolean(artwork.isLiked),
  };
}

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

  const userLikedArtworkIds = session?.user?.id
    ? new Set(
        (await Like.find({ userId: session.user.id }).lean()).map((like) =>
          like.artworkId.toString()
        )
      )
    : new Set<string>();

  if (liked && session?.user?.id) {
    const likes = await Like.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const artworkIds = likes.map((like) => like.artworkId);

    const likedArtworks = await Artwork.find({
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

    artworks = likedArtworks.map((artwork) =>
      serializeArtwork({
        ...artwork,
        likeCount: likeCountMap.get(artwork._id.toString()) ?? 0,
        isLiked: userLikedArtworkIds.has(artwork._id.toString()),
      })
    );
  } else {
    artworks = (await getArtworks()).map((artwork) =>
      serializeArtwork({
        ...artwork,
        isLiked: userLikedArtworkIds.has(artwork._id.toString()),
      })
    );
  }

  return (
    <>
      <PageIntro
        title="Artworks"
        subtitle="Not every gallery has opening hours. Some just happen to be on your way."
        bgImage="/images/stage_artworks.jpg"
        className="font-fjalla rounded-none h-70 lg:h-80 sm:px-5 md:px-10 lg:px-40 lg:py-15 text-black"
      />

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

      <section className="mx-auto my-8 max-w-6xl px-4">
        <ArtworkList artworks={artworks} isLikedFilterActive={liked} />
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
