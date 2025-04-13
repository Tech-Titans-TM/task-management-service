import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI: any = process.env.MONGO_URI;

const connectMongoDB = async () => {
  console.log("Connecting MongoDB database...");
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB successfully connected.");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectMongoDB;
