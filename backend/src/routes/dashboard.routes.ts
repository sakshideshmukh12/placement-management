
import { Router } from "express";
import { getDashboardSummaryController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { API_ENDPOINTS_V1 } from "../constants/endpoints.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard summary APIs
 */

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     description: Retrieves summary data for the authenticated user.
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Summary data returned by the dashboard controller
 *       401:
 *         description: Authentication required or token invalid
 *       500:
 *         description: Internal server error
 */
router.get(
  API_ENDPOINTS_V1.DASHBOARD.SUMMARY,
  authenticate,
  getDashboardSummaryController,
);

export default router;
