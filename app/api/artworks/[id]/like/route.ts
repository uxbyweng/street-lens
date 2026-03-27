// app\api\artworks\[id]\like\route.ts
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/mongodb";
import { Like } from "@/lib/models/like";
import { Artwork } from "@/lib/models/artwork";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// POST → Like setzen und mit ID (Artwork) verknüpfen
export async function POST(_request: Request, { params }: RouteContext) {
  const { id: artworkId } = await params;

  // Check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(artworkId)) {
    return NextResponse.json(
      { message: "Invalid artwork id." },
      { status: 400 }
    );
  }

  // Check if User is logged in
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  // Check if userID is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ message: "Invalid user id." }, { status: 400 });
  }

  // Datenbank Verbindung herstellen
  await connectDB();

  // Check, ob passendes Artwork existiert
  const artworkExists = await Artwork.exists({ _id: artworkId });
  if (!artworkExists) {
    return NextResponse.json(
      { message: "Artwork not found." },
      { status: 404 }
    );
  }

  // Like erstellen
  try {
    await Like.create({
      artworkId,
      userId,
    });
  } catch (error: unknown) {
    const isDuplicateKeyError =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000;

    if (!isDuplicateKeyError) {
      console.error("POST /api/artworks/[id]/like error:", error);
      return NextResponse.json(
        { message: "Could not create like." },
        { status: 500 }
      );
    }
  }

  // Likes neue berechnen/zählen
  const likeCount = await Like.countDocuments({ artworkId });
  return NextResponse.json(
    {
      liked: true,
      likeCount,
    },
    { status: 200 }
  );
}

// POST → Like entfernen
export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id: artworkId } = await params;

  // Check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(artworkId)) {
    return NextResponse.json(
      { message: "Invalid artwork id." },
      { status: 400 }
    );
  }

  // Check id User is logged in
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  // Check if userID is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ message: "Invalid user id." }, { status: 400 });
  }

  // Datenbank Verbindung herstellen
  await connectDB();

  // Like entfernen
  await Like.findOneAndDelete({
    artworkId,
    userId,
  });

  // Likes neue berechnen/zählen
  const likeCount = await Like.countDocuments({ artworkId });
  return NextResponse.json(
    {
      liked: false,
      likeCount,
    },
    { status: 200 }
  );
}
