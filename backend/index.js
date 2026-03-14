import { connectDatabase } from "./src/config/database.js";
import { env } from "./src/config/env.js";
import { app } from "./src/app.js";
import { seedProducts } from "./src/services/seed.service.js";

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
