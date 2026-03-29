import type { MetadataRoute } from "next";

import { connectDB } from "@/lib/db/mongodb";
import { Artwork } from "@/lib/models/artwork";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://street-lens.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const artworks = await Artwork.find()
    .select("_id updatedAt")
    .sort({ createdAt: -1 })
    .lean();

  const artworkEntries: MetadataRoute.Sitemap = artworks.map((artwork) => ({
    url: `${BASE_URL}/artworks/${artwork._id.toString()}`,
    lastModified: artwork.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/artworks`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/map`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...artworkEntries,
  ];
}
