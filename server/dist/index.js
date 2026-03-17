import app from "./app.js";
import { env } from "./config/env.js";
import { ensureAppInitialized } from "./services/bootstrap.service.js";
async function startServer() {
    try {
        await ensureAppInitialized();
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
