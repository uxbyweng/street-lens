import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db/mongodb";
import { Artwork } from "@/lib/models/artwork";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

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
        cloudinaryPublicId: body.cloudinaryPublicId ?? "",
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

    const artwork = await Artwork.findById(id);

    if (!artwork) {
      return NextResponse.json(
        { ok: false, message: "Artwork not found." },
        { status: 404 }
      );
    }

    if (artwork.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(artwork.cloudinaryPublicId, {
          resource_type: "image",
          invalidate: true,
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary image deletion failed:", cloudinaryError);
      }
    }

    await Artwork.findByIdAndDelete(id);

    revalidatePath("/");
    revalidatePath("/artworks");
    revalidatePath(`/artworks/${id}`);
    revalidatePath("/map");

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
