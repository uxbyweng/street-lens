import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Artwork } from "@/lib/models/artwork";

export async function GET() {
  try {
    await connectDB();
    const artwork = await Artwork.find().sort({ createdAt: -1 });

    return NextResponse.json({ ok: true, data: artwork });
  } catch (error) {
    console.error("GET /api/artwork error:", error);

    return NextResponse.json(
      { ok: false, message: "Failed to fetch artwork" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const newArtwork = await Artwork.create({
      title: body.title,
      author: body.author,
      description: body.description,
      imageUrl: body.imageUrl ?? "",
      locationName: body.locationName,
      coordinates: body.coordinates ?? undefined,
      tags: body.tags ?? [],
    });

    return NextResponse.json({ ok: true, data: newArtwork }, { status: 201 });
  } catch (error) {
    console.error("POST /api/artwork error:", error);

    return NextResponse.json(
      { ok: false, message: "Failed to create artwork" },
      { status: 500 }
    );
  }
}
