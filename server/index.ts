import { connectDatabase } from "./src/config/database.ts";
import { env } from "./src/config/env.ts";
import { app } from "./src/app.ts";
import { seedProducts } from "./src/services/seed.service.ts";

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
