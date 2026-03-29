"use server";

import { revalidatePath } from "next/cache";

/**
 * Server Action zum Invalidieren des Client- und Server-Caches.
 * Muss als Server Action aufgerufen werden, damit auch der
 * Client-seitige Router Cache invalidiert wird.
 */
export async function revalidateArtworkPaths(artworkId?: string) {
  revalidatePath("/");
  revalidatePath("/artworks");
  revalidatePath("/map");

  if (artworkId) {
    revalidatePath(`/artworks/${artworkId}`);
  }
}
