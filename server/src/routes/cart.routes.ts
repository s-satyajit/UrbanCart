import { Router } from "express";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cart.controller.ts";
import { requireAuth } from "../middleware/auth.ts";

const router = Router();

router.use(requireAuth);
router.get("/", getCart);
router.post("/items", addCartItem);
router.patch("/items/:productId", updateCartItem);
router.delete("/items/:productId", removeCartItem);

export default router;
