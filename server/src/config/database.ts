import mongoose from "mongoose";
import { env } from "./env.js";

let memoryServer = null;
let connectPromise: Promise<typeof mongoose> | null = null;

function maskConnectionUri(uri: string) {
  try {
    const parsed = new URL(uri);

    if (parsed.username || parsed.password) {
      parsed.username = "***";
      parsed.password = "***";
    }

    return parsed.toString();
  } catch {
    return "<invalid-uri>";
  }
}

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (connectPromise) {
    await connectPromise;
    return;
  }

  mongoose.set("strictQuery", true);
  const maskedUri = maskConnectionUri(env.mongoUri);

  try {
    connectPromise = mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    await connectPromise;
    console.log(`MongoDB connected at ${maskedUri}`);
  } catch (error) {
    connectPromise = null;

    if (env.nodeEnv === "production") {
      throw error;
    }

    console.warn(
      `MongoDB unavailable at ${maskedUri}. Falling back to in-memory MongoDB for development.`
    );

    const { MongoMemoryServer } = await import("mongodb-memory-server");

    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: "urban-cart",
      },
    });

    await mongoose.connect(memoryServer.getUri(), {
      dbName: "urban-cart",
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
