import Image from "next/image";
import { BackgroundMap } from "@/components/map/background-map";
import { auth } from "@/auth";
import { Like } from "@/lib/models/like";
import { Artwork } from "@/lib/models/artwork";
import { LikedArtworks } from "@/components/profile/liked-artworks";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="relative h-svh overflow-hidden">
        <BackgroundMap />
        <section className="relative z-10 mx-auto flex max-w-md items-center px-4 py-6">
          <div className="w-full rounded-2xl border border-white/10 bg-background/90 p-6 shadow-2xl backdrop-blur-md">
            <h1 className="text-2xl font-bold">Access denied</h1>
            <p className="mt-2 text-muted-foreground">
              You need to sign in to view your profile.
            </p>
          </div>
        </section>
      </div>
    );
  }

  const likes = await Like.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const artworkIds = likes.map((like) => like.artworkId.toString());

  const artworks = await Artwork.find({
    _id: { $in: artworkIds },
  }).lean();

  const likedArtworks = likes
    .map((like) => {
      const artwork = artworks.find(
        (artwork) => artwork._id.toString() === like.artworkId.toString()
      );

      if (!artwork) return null;

      return {
        _id: artwork._id.toString(),
        title: artwork.title,
        artist: artwork.artist,
        imageUrl: artwork.imageUrl,
        createdAt: like.createdAt.toString(),
      };
    })
    .filter(Boolean);

  return (
    <div className="relative h-svh overflow-hidden">
      <BackgroundMap />
      <section className="relative z-10 mx-auto flex max-w-md items-center px-4 py-6">
        <div className="w-full rounded-2xl border border-white/10 bg-background/90 p-6 shadow-2xl backdrop-blur-md">
          <h1 className="text-2xl font-bold">Profile</h1>

          <div className="mt-4 flex items-center gap-3">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "User avatar"}
                width={64}
                height={64}
                className="rounded-full border"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border text-lg font-medium">
                {(session.user.name ?? session.user.username ?? "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div>
              <p className="truncate text-sm font-medium">
                {session.user.name ?? session.user.username ?? "User"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {session.user.role ?? "User"}
              </p>
            </div>
          </div>

          <LikedArtworks likedArtworks={likedArtworks} />
        </div>
      </section>
    </div>
  );
}
