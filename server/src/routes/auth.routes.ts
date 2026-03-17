import { Router } from "express";
import {
  getSession,
  login,
  logout,
  requestRegisterOtp,
  verifyRegisterOtp,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/session", getSession);
router.post("/register", requestRegisterOtp);
router.post("/register/request-otp", requestRegisterOtp);
router.post("/register/verify", verifyRegisterOtp);
router.post("/login", login);
router.post("/logout", requireAuth, logout);

export default router;

