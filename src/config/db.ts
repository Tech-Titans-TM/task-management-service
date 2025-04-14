import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../util/logger";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectMongoDB = async () => {
  logger.info("Connecting MongoDB database...");

  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }

    await mongoose.connect(MONGO_URI);
    logger.info("MongoDB successfully connected.");
  } catch (error) {
    logger.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectMongoDB;
