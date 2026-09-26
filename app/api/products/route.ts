import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Product from "../../../lib/Product";

export const dynamic = "force-dynamic"; 

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({});
    return NextResponse.json(products.reverse());
  } catch (error: any) {
    console.error("🔴 GET ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const newProduct = await Product.create(body);
    console.log("🟢 PRODUCT SUCCESSFULLY SAVED:", newProduct.name);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("🔴 POST ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✏️ PUT: Edit/Update existing product using Mongoose
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID not found" }, { status: 400 });
    }

    const body = await request.json();
    await connectDB();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: body.name,
        price: body.price,
        desc: body.desc,
        image: body.image,
        images: body.images || [],
        imgPosition: body.imgPosition || "center",
      },
      { new: true } // Returns the updated document
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.log("🟢 PRODUCT SUCCESSFULLY UPDATED:", updatedProduct.name);
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    console.error("🔴 PUT ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE function: Remove product from database
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID not found" }, { status: 400 });
    }

    await connectDB();
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product deleted successfully!" }, { status: 200 });
  } catch (error: any) {
    console.error("🔴 DELETE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}