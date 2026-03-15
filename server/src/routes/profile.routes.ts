import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.ts";
import { requireAuth } from "../middleware/auth.ts";

const router = Router();

router.use(requireAuth);
router.get("/", getProfile);
router.put("/", updateProfile);

export default router;
