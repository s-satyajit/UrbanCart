import { app } from "./app.ts";
import { connectDatabase } from "./config/database.ts";
import { env } from "./config/env.ts";
import { seedProducts } from "./services/seed.service.ts";

async function startServer() {
  try {
    await connectDatabase();
    await seedProducts();

    app.listen(env.port, () => {
      console.log(`Urban Cart API running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
