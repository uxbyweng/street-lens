import { NextResponse } from "next/server";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

function uploadBufferToCloudinary(
  buffer: Buffer,
  options?: {
    folder?: string;
    public_id?: string;
    resource_type?: "image" | "video" | "raw" | "auto";
  }
): Promise<UploadApiResponse> {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options?.folder,
        public_id: options?.public_id,
        resource_type: options?.resource_type ?? "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload returned no result."));
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, message: "No image file provided." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, message: "Only image files are allowed." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const safePublicId = `${Date.now()}-${originalName}`
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-");

    const result = await uploadBufferToCloudinary(buffer, {
      folder: "street-lens",
      public_id: safePublicId,
      resource_type: "image",
    });

    return NextResponse.json(
      {
        ok: true,
        data: {
          secureUrl: result.secure_url,
          publicId: result.public_id,
          originalFilename: result.original_filename,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/upload error:", error);

    return NextResponse.json(
      { ok: false, message: "Image upload failed." },
      { status: 500 }
    );
  }
}
