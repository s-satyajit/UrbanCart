import { aboutContent } from "../constants/site-content.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { Product } from "../models/Product.js";
import { getUserSummary } from "../services/account.service.js";
import { serializeProduct } from "../utils/serializers.js";

export const getStorefront = asyncHandler(async (req, res) => {
  const featuredProducts = await Product.find({ featured: true }).limit(4);
  const summary = req.auth?.isAuthenticated
    ? await getUserSummary(req.auth.user._id)
    : {
        cartCount: 0,
        cartTotal: 0,
        wishlistCount: 0,
        ordersCount: 0,
      };

  const displayName = req.auth?.user?.name || "Guest";

  res.json({
    hero: {
      title: `Hello, ${displayName}`,
      subtitle:
        "Shop products, save favorites, manage orders, and keep your account synced.",
    },
    featured: featuredProducts.map((product) => serializeProduct(product)),
    about: aboutContent,
    summary,
  });
});

