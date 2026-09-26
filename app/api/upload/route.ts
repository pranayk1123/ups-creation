import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "Photo aala nahi" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.name.replace(/\s+/g, '-');
    const savedName = `${uniqueSuffix}-${filename}`;
    
    // Photo public/uploads folder madhe save hoil
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch(e) {}

    const filepath = path.join(uploadDir, savedName);
    await writeFile(filepath, buffer);

    return NextResponse.json({ url: `/uploads/${savedName}` });
  } catch (error) {
    console.error("🔴 PHOTO UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}