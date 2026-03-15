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

export const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: false,
  })
);
app.use(express.json());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(optionalAuth);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "urban-cart-api" });
});

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
