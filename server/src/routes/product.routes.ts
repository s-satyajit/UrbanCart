import { Router } from "express";
import { getProducts, searchProducts } from "../controllers/product.controller.ts";

const router = Router();

router.get("/search", searchProducts);
router.get("/", getProducts);

export default router;
