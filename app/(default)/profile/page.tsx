// app\(default)\profile\page.tsx

import Image from "next/image";
import { BackgroundMap } from "@/components/map/background-map";
import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="relative h-svh overflow-hidden">
        <BackgroundMap />
        <section className="relative z-10 mx-auto flex h-svh max-w-md items-center px-4 py-12">
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
        </div>
      </section>
    </div>
  );
}
