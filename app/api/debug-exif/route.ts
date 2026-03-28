import { NextResponse } from "next/server";
import exifr from "exifr";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No file received." },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();

    let gpsFromBuffer: unknown = null;
    let parsedGpsOnly: unknown = null;
    let parsedAll: unknown = null;

    try {
      gpsFromBuffer = await exifr.gps(buffer);
    } catch (error) {
      gpsFromBuffer = {
        error: error instanceof Error ? error.message : String(error),
      };
    }

    try {
      parsedGpsOnly = await exifr.parse(buffer, { gps: true });
    } catch (error) {
      parsedGpsOnly = {
        error: error instanceof Error ? error.message : String(error),
      };
    }

    try {
      parsedAll = await exifr.parse(buffer, true);
    } catch (error) {
      parsedAll = {
        error: error instanceof Error ? error.message : String(error),
      };
    }

    return NextResponse.json({
      success: true,
      fileMeta: {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      },
      gpsFromBuffer,
      parsedGpsOnly,
      parsedAll,
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
