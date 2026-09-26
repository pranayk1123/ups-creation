import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return; // Aadhi pasun connect asel tar parat nako karu
    }
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully! 🎉");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};