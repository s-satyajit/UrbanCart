import type { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { env } from "./env.js";

let memoryServer = null;

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected at ${env.mongoUri}`);
  } catch (error) {
    if (env.nodeEnv === "production") {
      throw error;
    }

    console.warn(
      `MongoDB unavailable at ${env.mongoUri}. Falling back to in-memory MongoDB for development.`
    );

    const { MongoMemoryServer } = await import("mongodb-memory-server");

    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: "task-eleven-store",
      },
    });

    await mongoose.connect(memoryServer.getUri(), {
      dbName: "task-eleven-store",
    });

    console.log("MongoDB memory server connected");
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

