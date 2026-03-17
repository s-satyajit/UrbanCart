import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { optionalAuth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import authRoutes from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import contentRoutes from "./routes/content.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import storefrontRoutes from "./routes/storefront.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import { ensureAppInitialized } from "./services/bootstrap.service.js";

const app = express();
const allowedOrigins = new Set(env.clientUrls);
const allowAnyOrigin = allowedOrigins.has("*");

function isAllowedVercelOrigin(origin: string) {
  try {
    const parsed = new URL(origin);
    return parsed.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowAnyOrigin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      if (env.nodeEnv === "production" && isAllowedVercelOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS origin is not allowed: ${origin}`));
    },
    credentials: false,
  })
);
app.use(express.json());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "urban-cart-api" });
});

app.use("/api", async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    await ensureAppInitialized();
    return next();
  } catch (error) {
    return next(error);
  }
});

app.use("/api", optionalAuth);
app.use("/api/auth", authRoutes);
app.use("/api/storefront", storefrontRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/content", contentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
