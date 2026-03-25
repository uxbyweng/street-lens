import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/mongodb";
import { Like } from "@/lib/models/likes";
import { Artwork } from "@/lib/models/artwork";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function POST(_request: Request, { params }: RouteContext) {
  const artworkId = params.id;

  if (!mongoose.Types.ObjectId.isValid(artworkId)) {
    return NextResponse.json(
      { message: "Invalid artwork id." },
      { status: 400 }
    );
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ message: "Invalid user id." }, { status: 400 });
  }

  await connectDB();

  const artworkExists = await Artwork.exists({ _id: artworkId });

  if (!artworkExists) {
    return NextResponse.json(
      { message: "Artwork not found." },
      { status: 404 }
    );
  }

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
      error.code === 11000;

    if (!isDuplicateKeyError) {
      console.error("POST /api/artworks/[id]/like error:", error);
      return NextResponse.json(
        { message: "Could not create like." },
        { status: 500 }
      );
    }
  }

  const likeCount = await Like.countDocuments({ artworkId });

  return NextResponse.json(
    {
      liked: true,
      likeCount,
    },
    { status: 200 }
  );
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const artworkId = params.id;

  if (!mongoose.Types.ObjectId.isValid(artworkId)) {
    return NextResponse.json(
      { message: "Invalid artwork id." },
      { status: 400 }
    );
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ message: "Invalid user id." }, { status: 400 });
  }

  await connectDB();

  await Like.findOneAndDelete({
    artworkId,
    userId,
  });

  const likeCount = await Like.countDocuments({ artworkId });

  return NextResponse.json(
    {
      liked: false,
      likeCount,
    },
    { status: 200 }
  );
}
