import { Router } from "express";
import {
  checkout,
  getOrders,
  verifyCheckoutPayment,
} from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", getOrders);
router.post("/checkout", checkout);
router.post("/checkout/verify", verifyCheckoutPayment);

export default router;

