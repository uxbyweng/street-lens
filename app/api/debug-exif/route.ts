import { NextResponse } from "next/server";
import exifr from "exifr";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "No valid file received." },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();

    const gps = await exifr.gps(buffer);
    const parsed = await exifr.parse(buffer, true);

    return NextResponse.json({
      success: true,
      gps,
      latitude: parsed?.latitude,
      longitude: parsed?.longitude,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
