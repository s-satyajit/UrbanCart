import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.ts";
import { optionalAuth } from "./middleware/auth.ts";
import { errorHandler } from "./middleware/error-handler.ts";
import { notFoundHandler } from "./middleware/not-found.ts";
import authRoutes from "./routes/auth.routes.ts";
import cartRoutes from "./routes/cart.routes.ts";
import contactRoutes from "./routes/contact.routes.ts";
import contentRoutes from "./routes/content.routes.ts";
import orderRoutes from "./routes/order.routes.ts";
import productRoutes from "./routes/product.routes.ts";
import profileRoutes from "./routes/profile.routes.ts";
import storefrontRoutes from "./routes/storefront.routes.ts";
import wishlistRoutes from "./routes/wishlist.routes.ts";

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
