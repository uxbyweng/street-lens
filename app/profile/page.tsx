import Image from "next/image";
import { PageIntro } from "@/components/layout/page-intro";
import { BackgroundMap } from "@/components/map/background-map";
import { auth } from "@/auth";
import { Like } from "@/lib/models/like";
import { Artwork } from "@/lib/models/artwork";
import { LikedArtworks } from "@/components/profile/liked-artworks";
import { ProfileLocationCard } from "@/components/profile/profile-location-card";

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
    <>
      <PageIntro
        title="Profile"
        subtitle="Your personal corner."
        bgImage="/images/profile_stage_image.jpg"
        className="font-fjalla rounded-none h-50 lg:h-80 sm:px-5 md:px-10 lg:px-40 lg:py-15 text-black"
      />

      <section className="mx-auto mt-4 max-w-6xl px-4 lg:hidden">
        <div className="rounded-2xl border border-white/10 bg-background/90 p-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-4">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "User avatar"}
                width={72}
                height={72}
                className="rounded-full border"
              />
            ) : (
              <div className="flex h-18 w-18 items-center justify-center rounded-full border text-xl font-medium">
                {(session.user.name ?? session.user.username ?? "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-base font-semibold">
                {session.user.name ?? session.user.username ?? "User"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground capitalize">
                {session.user.role ?? "User"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto my-10 max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LikedArtworks likedArtworks={likedArtworks} />
          </div>

          <aside className="lg:col-span-1">
            <div className="space-y-6">
              <div className="hidden rounded-2xl border border-white/10 bg-background/90 p-6 shadow-2xl backdrop-blur-md lg:block">
                <div className="flex items-center gap-4">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? "User avatar"}
                      width={72}
                      height={72}
                      className="rounded-full border"
                    />
                  ) : (
                    <div className="flex h-18 w-18 items-center justify-center rounded-full border text-xl font-medium">
                      {(session.user.name ?? session.user.username ?? "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                      {session.user.name ?? session.user.username ?? "User"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground capitalize">
                      {session.user.role ?? "User"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-background/90 shadow-2xl backdrop-blur-md">
                <div className="h-72">
                  <ProfileLocationCard />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
