import { connectDatabase } from "../config/database.js";
import { seedProducts } from "./seed.service.js";

let bootstrapPromise: Promise<void> | null = null;

export async function ensureAppInitialized() {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    await connectDatabase();
    await seedProducts();
  })().catch((error) => {
    bootstrapPromise = null;
    throw error;
  });

  return bootstrapPromise;
}
