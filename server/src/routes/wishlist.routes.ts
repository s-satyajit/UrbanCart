import { Router } from "express";
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "../controllers/wishlist.controller.ts";
import { requireAuth } from "../middleware/auth.ts";

const router = Router();

router.use(requireAuth);
router.get("/", getWishlist);
router.post("/items", addWishlistItem);
router.delete("/items/:productId", removeWishlistItem);

export default router;
