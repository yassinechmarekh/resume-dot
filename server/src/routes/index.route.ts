import { Router } from "express";
import authRoutes from "./auth.route";
import resumeRoutes from "./resume.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/resume", resumeRoutes);

export default router;
