import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { seedProducts } from "./services/seed.service.js";
async function startServer() {
    try {
        await connectDatabase();
        await seedProducts();
        app.listen(env.port, () => {
            console.log(`Urban Cart API running on port ${env.port}`);
        });
    }
    catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
}
startServer();
