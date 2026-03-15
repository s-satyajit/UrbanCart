import { Router } from "express";
import { getStorefront } from "../controllers/storefront.controller.js";

const router = Router();

router.get("/", getStorefront);

export default router;
