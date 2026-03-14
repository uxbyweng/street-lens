import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db/mongodb";
import { Artwork } from "@/lib/models/artwork";
import { revalidatePath } from "next/cache";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await connectDB();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid artwork ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      id,
      {
        title: body.title,
        artist: body.artist,
        description: body.description,
        imageUrl: body.imageUrl ?? "",
        latitude: body.latitude ?? undefined,
        longitude: body.longitude ?? undefined,
        tags: body.tags ?? [],
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedArtwork) {
      return NextResponse.json(
        { ok: false, message: "Artwork not found." },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/artworks");
    revalidatePath(`/artworks/${id}`);

    return NextResponse.json(
      { ok: true, data: updatedArtwork },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/artworks/[id] error:", error);

    return NextResponse.json(
      { ok: false, message: "Failed to update artwork." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await connectDB();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid artwork ID." },
        { status: 400 }
      );
    }

    const deletedArtwork = await Artwork.findByIdAndDelete(id);

    if (!deletedArtwork) {
      return NextResponse.json(
        { ok: false, message: "Artwork not found." },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/artworks");
    revalidatePath(`/artworks/${id}`);

    return NextResponse.json(
      { ok: true, message: "Artwork successfully deleted." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/artworks/[id] error:", error);

    return NextResponse.json(
      { ok: false, message: "Failed to delete artwork." },
      { status: 500 }
    );
  }
}
