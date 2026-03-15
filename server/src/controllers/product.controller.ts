import { asyncHandler } from "../middleware/async-handler.ts";
import { Product } from "../models/Product.ts";
import { findProductsBySmartSearch } from "../services/product-search.service.ts";
import { serializeProduct } from "../utils/serializers.ts";

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ featured: -1, createdAt: -1 });
  res.json(products.map((product) => serializeProduct(product)));
});

export const searchProducts = asyncHandler(async (req, res) => {
  const query = req.query.q?.trim() || "";
  const searchResult = await findProductsBySmartSearch(query);

  res.json({
    query: searchResult.meta.query,
    total: searchResult.meta.total,
    usedAI: searchResult.meta.usedAI,
    interpreted: searchResult.meta.interpreted,
    items: searchResult.items.map((entry) => ({
      ...serializeProduct(entry.product),
      matchedOn: entry.matchedOn,
      searchScore: entry.score,
    })),
  });
});
