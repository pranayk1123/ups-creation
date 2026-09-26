import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Product from "../../../lib/Product";

export const dynamic = "force-dynamic"; 

export async function GET() {
  try {
    await connectDB();
    // ITHI BADAL KELA AHE: .sort() kadun takla jyamule MongoDB chi memory full honar nahi.
    // Data aalyavar tyala .reverse() karun pathvtoy mhanje navin product aadhi disel.
    const products = await Product.find({});
    return NextResponse.json(products.reverse());
  } catch (error: any) {
    console.error("🔴 KHARA GET ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const newProduct = await Product.create(body);
    console.log("🟢 PRODUCT SUCCESSFUL SAVE ZALA:", newProduct.name);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("🔴 KHARA POST ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE function: Website varun product udavnyasathi
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id"); // Link madhun ID gheil

    if (!id) {
      return NextResponse.json({ error: "Product ID milala nahi" }, { status: 400 });
    }

    await connectDB();
    await Product.findByIdAndDelete(id); // Database madhun direct delete

    return NextResponse.json({ message: "Product delete zala!" }, { status: 200 });
  } catch (error: any) {
    console.error("🔴 DELETE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}