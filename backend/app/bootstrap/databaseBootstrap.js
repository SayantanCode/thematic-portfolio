import mongoose from "mongoose";
import { env } from "../../config/index.js";

export async function bootstrapDatabase() {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongoUri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 10000,
  });

  console.log("[bootstrap] MongoDB connected");

  mongoose.connection.on("error", (err) => {
    console.error("[mongo] connection error:", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("[mongo] disconnected");
  });

  return mongoose.connection;
}
