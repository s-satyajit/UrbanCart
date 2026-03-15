import { Router } from "express";
import {
  getSession,
  login,
  logout,
  register,
} from "../controllers/auth.controller.ts";
import { requireAuth } from "../middleware/auth.ts";

const router = Router();

router.get("/session", getSession);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", requireAuth, logout);

export default router;
