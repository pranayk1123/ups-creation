import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary connection setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "Photo aala nahi" }, { status: 400 });
    }

    // Photo buffer madhe convert kar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cloudinary la pathavnyasathi Base64 format madhe convert kar
    const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Cloudinary var direct upload kar
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: "ups-creation", // Cloudinary madhe ya navacha folder aapoap banel
    });

    // Cloudinary kadun aaleli direct link Next.js la de
    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error("🔴 CLOUDINARY UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}