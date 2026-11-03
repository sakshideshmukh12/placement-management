
import { Router } from "express";
import { UserRole } from "../constants/roles.js";

import {
  addApplication,
  changeApplicationStatus,
  getApplication,
} from "../controllers/application.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { createApplicationSchema } from "../dtos/application/create-application.dto.js";
import { updateApplicationSchema } from "../dtos/application/update-application.dto.js";
import { studentIdSchema } from "../dtos/student/student-id.dto.js";
import { API_ENDPOINTS_V1 } from "../constants/endpoints.js";

const router = Router();
  /**
 * @swagger
 * /applications:
 *   post:
 *     summary: Apply for a placement opportunity
 *     tags: [Applications]
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Apply for a placement opportunity
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Request data validated by createApplicationSchema
 *             properties:
 *               placementDriveId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Application created successfully
 *       400:
 *         description: Invalid application data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only students can apply
 *       409:
 *         description: Application already exists or conflicts with existing data
 */
router.post(
  API_ENDPOINTS_V1.APPLICATIONS.CREATE,
  authenticate,
  authorizeRoles(UserRole.STUDENT),
  validate(createApplicationSchema),
  addApplication,
);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get applications based on the logged-in user's role
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.get(
  API_ENDPOINTS_V1.APPLICATIONS.GET_ALL,
  authenticate,
  getApplication,
);

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get a specific application
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Application not found
 */
router.get(
  API_ENDPOINTS_V1.APPLICATIONS.GET,
  authenticate,
  getApplication,
);

/**
 * @swagger
 * /applications/{id}:
 *   patch:
 *     summary: Update an application's status
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Request data validated by updateApplicationSchema
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPLIED, SHORTLISTED, SELECTED, REJECTED]
 *                 example: SHORTLISTED
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *       400:
 *         description: Invalid status or application data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or placement coordinator access required
 *       404:
 *         description: Application not found
 */
router.patch(
  API_ENDPOINTS_V1.APPLICATIONS.UPDATE,
  authenticate,
  authorizeRoles(UserRole.PLACEMENT_COORDINATOR, UserRole.ADMIN),
  validate(studentIdSchema, "params"),
  validate(updateApplicationSchema),
  changeApplicationStatus,
);

export default router;
