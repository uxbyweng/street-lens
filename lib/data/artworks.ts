import { cache } from "react";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db/mongodb";
import { Artwork as ArtworkModel } from "@/lib/models/artwork";
import type { Artwork } from "@/types/artwork";
import { Like } from "@/lib/models/like";

const DEFAULT_ARTWORKS_PAGE_SIZE = 15;

type ArtworkDocumentLike = {
  _id: Types.ObjectId;
  title: string;
  artist?: string;
  description?: string;
  imageUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  tags?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

function toIsoString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  return undefined;
}

function serializeArtwork(
  doc: ArtworkDocumentLike,
  likeCount = 0,
  isLiked = false
): Artwork & { likeCount: number; isLiked: boolean } {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    artist: doc.artist ?? "",
    description: doc.description ?? "",
    imageUrl: doc.imageUrl ?? "",
    latitude: doc.latitude ?? null,
    longitude: doc.longitude ?? null,
    tags: doc.tags ?? [],
    createdAt: toIsoString(doc.createdAt),
    updatedAt: toIsoString(doc.updatedAt),
    likeCount,
    isLiked,
  };
}

// Lade paginierte Artworks aus Datenbank.
// Neueste Einträge nach oben.
export async function getArtworks(
  page = 1,
  limit = DEFAULT_ARTWORKS_PAGE_SIZE
): Promise<Artwork[]> {
  await connectDB();

  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const skip = (safePage - 1) * safeLimit;

  const artworks = await ArtworkModel.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit)
    .lean();

  const artworkIds = artworks.map((artwork) => artwork._id);

  const likeCounts =
    artworkIds.length > 0
      ? await Like.aggregate([
          {
            $match: {
              artworkId: { $in: artworkIds },
            },
          },
          {
            $group: {
              _id: "$artworkId",
              likeCount: { $sum: 1 },
            },
          },
        ])
      : [];

  const likeCountMap = new Map<string, number>(
    likeCounts.map((entry) => [entry._id.toString(), entry.likeCount])
  );

  return artworks.map((artwork) =>
    serializeArtwork(artwork, likeCountMap.get(artwork._id.toString()) ?? 0)
  );
}

// Nur neueste Artworks aus Datenbank laden.
// per default werden 3 Einträge geladen.
export async function getLatestArtworks(
  limit = 3,
  userId?: string
): Promise<(Artwork & { likeCount: number; isLiked: boolean })[]> {
  await connectDB();

  const artworks = await ArtworkModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const artworkIds = artworks.map((artwork) => artwork._id);

  const likeCounts = await Like.aggregate([
    {
      $match: {
        artworkId: { $in: artworkIds },
      },
    },
    {
      $group: {
        _id: "$artworkId",
        likeCount: { $sum: 1 },
      },
    },
  ]);

  const likeCountMap = new Map<string, number>(
    likeCounts.map((entry) => [entry._id.toString(), entry.likeCount])
  );

  let userLikedArtworkIds = new Set<string>();

  if (userId && Types.ObjectId.isValid(userId)) {
    const userLikes = await Like.find({
      userId,
      artworkId: { $in: artworkIds },
    }).lean();

    userLikedArtworkIds = new Set(
      userLikes.map((like) => like.artworkId.toString())
    );
  }

  return artworks.map((artwork) =>
    serializeArtwork(
      artwork,
      likeCountMap.get(artwork._id.toString()) ?? 0,
      userLikedArtworkIds.has(artwork._id.toString())
    )
  );
}

export async function getArtworksForOverview(options?: {
  userId?: string;
  likedOnly?: boolean;
  page?: number;
  limit?: number;
}): Promise<(Artwork & { likeCount: number; isLiked: boolean })[]> {
  await connectDB();

  const userId = options?.userId;
  const likedOnly = options?.likedOnly ?? false;
  const safePage = Math.max(1, options?.page ?? 1);
  const safeLimit = Math.max(1, options?.limit ?? DEFAULT_ARTWORKS_PAGE_SIZE);
  const skip = (safePage - 1) * safeLimit;

  let userLikedArtworkIds = new Set<string>();

  if (userId && Types.ObjectId.isValid(userId)) {
    const userLikes = await Like.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    userLikedArtworkIds = new Set(
      userLikes.map((like) => like.artworkId.toString())
    );

    if (likedOnly) {
      const pagedLikes = userLikes.slice(skip, skip + safeLimit);
      const artworkIds = pagedLikes.map((like) => like.artworkId);

      if (artworkIds.length === 0) {
        return [];
      }

      const likedArtworks = await ArtworkModel.find({
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
            likeCount: { $sum: 1 },
          },
        },
      ]);

      const likeCountMap = new Map<string, number>(
        likeCounts.map((entry) => [entry._id.toString(), entry.likeCount])
      );

      const likedArtworkMap = new Map(
        likedArtworks.map((artwork) => [artwork._id.toString(), artwork])
      );

      return artworkIds
        .map((artworkId) => {
          const artwork = likedArtworkMap.get(artworkId.toString());

          if (!artwork) return null;

          return serializeArtwork(
            artwork,
            likeCountMap.get(artwork._id.toString()) ?? 0,
            true
          );
        })
        .filter(
          (
            artwork
          ): artwork is Artwork & { likeCount: number; isLiked: boolean } =>
            artwork !== null
        );
    }
  }

  const artworks = await ArtworkModel.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit)
    .lean();

  const artworkIds = artworks.map((artwork) => artwork._id);

  const likeCounts =
    artworkIds.length > 0
      ? await Like.aggregate([
          {
            $match: {
              artworkId: { $in: artworkIds },
            },
          },
          {
            $group: {
              _id: "$artworkId",
              likeCount: { $sum: 1 },
            },
          },
        ])
      : [];

  const likeCountMap = new Map<string, number>(
    likeCounts.map((entry) => [entry._id.toString(), entry.likeCount])
  );

  return artworks.map((artwork) =>
    serializeArtwork(
      artwork,
      likeCountMap.get(artwork._id.toString()) ?? 0,
      userLikedArtworkIds.has(artwork._id.toString())
    )
  );
}

export const getArtworkById = cache(
  async (id: string): Promise<Artwork | null> => {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    await connectDB();

    const artwork = await ArtworkModel.findById(id).lean();

    if (!artwork) {
      return null;
    }

    return serializeArtwork(artwork);
  }
);

export const getArtworkMetadataById = cache(
  async (
    id: string
  ): Promise<Pick<
    Artwork,
    "_id" | "title" | "artist" | "description" | "imageUrl"
  > | null> => {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    await connectDB();

    const artwork = await ArtworkModel.findById(id)
      .select("title artist description imageUrl")
      .lean();

    if (!artwork) {
      return null;
    }

    return {
      _id: artwork._id.toString(),
      title: artwork.title,
      artist: artwork.artist,
      description: artwork.description,
      imageUrl: artwork.imageUrl,
    };
  }
);
