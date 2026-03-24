import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/mongodb";
import { Artwork } from "@/lib/models/artwork";
import { User } from "@/lib/models/user";

export async function GET() {
  try {
    await connectDB();
    const artwork = await Artwork.find().sort({ createdAt: -1 });

    return NextResponse.json({ ok: true, data: artwork });
  } catch (error) {
    console.error("GET /api/artworks error:", error);

    return NextResponse.json(
      { ok: false, message: "Failed to fetch artwork" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { ok: false, message: "Not authorized." },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { ok: false, message: "Forbidden." },
        { status: 403 }
      );
    }

    await connectDB();

    const owner = await User.findById(session.user.id);

    if (!owner) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const newArtwork = await Artwork.create({
      title: body.title,
      artist: body.artist,
      description: body.description,
      imageUrl: body.imageUrl ?? "",
      cloudinaryPublicId: body.cloudinaryPublicId ?? "",
      latitude: body.latitude ?? undefined,
      longitude: body.longitude ?? undefined,
      tags: body.tags ?? [],
      owner: owner._id,
    });

    revalidatePath("/");
    revalidatePath("/artworks");
    revalidatePath("/map");

    return NextResponse.json({ ok: true, data: newArtwork }, { status: 201 });
  } catch (error) {
    console.error("POST /api/artworks error:", error);

    return NextResponse.json(
      { ok: false, message: "Failed to create artwork" },
      { status: 500 }
    );
  }
}
