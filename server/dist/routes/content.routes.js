import { Router } from "express";
import { askAboutUrbanCart, getAbout } from "../controllers/content.controller.js";
const router = Router();
router.get("/about", getAbout);
router.post("/about/ask", askAboutUrbanCart);
export default router;
