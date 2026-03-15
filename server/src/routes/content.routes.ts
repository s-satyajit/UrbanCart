import { Router } from "express";
import { askAboutUrbanCart, getAbout } from "../controllers/content.controller.ts";
import {
  createContactAIDraft,
  createContactMessage,
  getContact,
} from "../controllers/contact.controller.ts";

const router = Router();

router.get("/about", getAbout);
router.post("/about/ask", askAboutUrbanCart);
router.get("/contact", getContact);
router.post("/contact", createContactMessage);
router.post("/contact/ai-draft", createContactAIDraft);

export default router;
