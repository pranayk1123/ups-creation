import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, default: "/logo.jpg.jpeg" },
    imgPosition: { type: String, default: "center" },
  },
  { timestamps: true }
);

// Jar aadhi pasun model asel tar to ghe, nahitar navin banav
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;