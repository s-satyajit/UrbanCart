import { Router } from "express";
import {
  createContactAIDraft,
  createContactMessage,
  getContact,
} from "../controllers/contact.controller.js";

const router = Router();

router.get("/", getContact);
router.post("/", createContactMessage);
router.post("/ai-draft", createContactAIDraft);

export default router;
