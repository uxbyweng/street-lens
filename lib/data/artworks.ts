import { cache } from "react";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db/mongodb";
import { Artwork as ArtworkModel } from "@/lib/models/artwork";
import type { Artwork } from "@/types/artwork";
import { Like } from "@/lib/models/like";

// Hilfsfunktion
// wandelt Datumswerte in einen ISO-String um,
// z. B.: "2026-03-10T12:00:00.000Z"
// damit bei ungültigen Werten nichts abstürzt sondern nur undefined zurückgegeben wird.
function toIsoString(value: unknown): string | undefined {
  // Wenn kein Wert vorhanden, 'undefined' zurückgeben.
  if (value === null || value === undefined) return undefined;

  // Wenn Wert bereits echtes Date-Objekt,
  // kann direkt toISOString() verwendet werden.
  if (value instanceof Date) {
    return value.toISOString();
  }

  // Wenn Wert String oder Zahl,
  // versuche daraus ein Date-Objekt zu bauen.
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  }
  // Wenn keine Prüfung funktioniert,
  // gebe 'undefined' zurück
  return undefined;
}

function serializeArtwork(doc: any, likeCount = 0): Artwork {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    artist: doc.artist,
    description: doc.description,
    imageUrl: doc.imageUrl,
    latitude: doc.latitude,
    longitude: doc.longitude,
    tags: doc.tags ?? [],
    createdAt: toIsoString(doc.createdAt),
    updatedAt: toIsoString(doc.updatedAt),
    likeCount,
  };
}

// Lade alle Artworks aus Datenbank.
// Neueste Einträge nach oben.
export async function getArtworks(): Promise<Artwork[]> {
  // 1. Verbindung zur Datenbank sicherstellen.
  await connectDB();

  // 2. Alle Artworks holen und nach createdAt absteigend sortieren.
  // .lean() gibt normale JavaScript-Objekte zurück
  // statt kompletter Mongoose-Dokumente.
  const artworks = await ArtworkModel.find().sort({ createdAt: -1 }).lean();

  const likeCounts = await Like.aggregate([
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

  // Jedes DB-Dokument in gewünschtes Artwork-Format umwandeln.
  return artworks.map((artwork) =>
    serializeArtwork(artwork, likeCountMap.get(artwork._id.toString()) ?? 0)
  );
}

// Nur neueste Artworks aus Datenbank laden.
// per default werden 3 Einträge geladen.
export async function getLatestArtworks(limit = 3): Promise<Artwork[]> {
  await connectDB();

  const artworks = await ArtworkModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  //   console.log(
  //     artworks.map((artwork) => ({
  //       title: artwork.title,
  //       createdAt: artwork.createdAt,
  //     }))
  //   );

  return artworks.map(serializeArtwork);
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
    "_id" | "title" | "artist" | "description"
  > | null> => {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    await connectDB();

    const artwork = await ArtworkModel.findById(id)
      .select("title artist description")
      .lean();

    if (!artwork) {
      return null;
    }

    return {
      _id: artwork._id.toString(),
      title: artwork.title,
      artist: artwork.artist,
      description: artwork.description,
    };
  }
);
