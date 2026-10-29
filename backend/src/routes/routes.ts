import { Router } from "express";
import studentRoutes from "./student.routes.js";
import companyRoutes from "./company.routes.js";
import PlacementDriveRoutes from "./placementDrive.routes.js";
import applicationRoutes from "./application.routes.js";
import authRoutes from "./auth.routes.js";
import interviewRoutes from "./interview.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();



router.use(studentRoutes);
router.use(companyRoutes);
router.use(applicationRoutes);
router.use(PlacementDriveRoutes);
router.use(interviewRoutes);
router.use(authRoutes);
router.use(dashboardRoutes);

export default router;
