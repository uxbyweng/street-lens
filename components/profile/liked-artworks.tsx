"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconHeart, IconChevronDown } from "@tabler/icons-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

type LikedArtworkPreview = {
  _id: string;
  title?: string;
  artist?: string;
  imageUrl: string;
  createdAt: string;
};

type LikedArtworksProps = {
  likedArtworks: LikedArtworkPreview[];
};

export function LikedArtworks({ likedArtworks }: LikedArtworksProps) {
  const likedCount = likedArtworks.length;

  const latestThreeLikes = [...likedArtworks]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <section>
      <AccordionPrimitive.Root
        type="single"
        collapsible
        defaultValue="liked-artworks"
      >
        <AccordionPrimitive.Item
          value="liked-artworks"
          className="rounded-2xl border border-white/10 bg-background/90 px-4 shadow-xl backdrop-blur-md"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between py-4">
              <div className="flex items-center gap-3 text-left">
                <IconHeart className="h-5 w-5 text-white" />
                <span className="text-lg font-semibold">
                  Liked Artworks ({likedCount})
                </span>
              </div>

              <IconChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>

          <AccordionPrimitive.Content className="pb-4">
            {likedCount === 0 ? (
              <p className="text-sm text-muted-foreground">
                There are no likes yet.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {latestThreeLikes.map((artwork) => (
                    <Link
                      key={artwork._id}
                      href={`/artworks/${artwork._id}`}
                      className="group"
                    >
                      <article className="relative overflow-hidden rounded-xl border border-white/10">
                        <div className="relative aspect-square">
                          <Image
                            src={artwork.imageUrl}
                            alt={artwork.title ?? artwork.artist ?? "Artwork"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 33vw, 120px"
                          />
                        </div>

                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/70 px-2 py-1">
                          <span className="truncate text-[10px] font-medium text-white">
                            {artwork.artist ?? "Unknown artist"}
                          </span>
                          <IconHeart className="h-4 w-4 fill-pink-500 text-pink-500" />
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                <Button asChild className="w-full md:w-auto mt-8 lg:mt-10">
                  <Link
                    href="/artworks?liked=true"
                    className="inline-flex items-center rounded-lg border border-white/15 px-3 py-2 text-sm font-medium transition hover:bg-white/5"
                  >
                    <span>See all likes</span>
                  </Link>
                </Button>
              </div>
            )}
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      </AccordionPrimitive.Root>
    </section>
  );
}
