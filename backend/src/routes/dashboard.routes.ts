import { Router } from "express";
import { getDashboardSummaryController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { API_ENDPOINTS_V1 } from "../constants/endpoints.js";

const router = Router();

router.get(API_ENDPOINTS_V1.DASHBOARD.SUMMARY, authenticate, getDashboardSummaryController);

export default router;  