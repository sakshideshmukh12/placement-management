
import { Router } from "express";

import {
  addPlacementDrive,
  fetchPlacementDriveById,
  fetchPlacementDrives,
  fetchPlacementAnalytics,
  editPlacementDrive,
  partiallyUpdatePlacementDrive,
  removePlacementDrive,
} from "../controllers/placementDrive.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { createPlacementDriveSchema } from "../dtos/placement-drive/create-placement-drive.dto.js";
import { updatePlacementDriveSchema } from "../dtos/placement-drive/update-placement-drive.dto.js";
import { studentIdSchema } from "../dtos/student/student-id.dto.js";
import { UserRole } from "../constants/roles.js";
import { API_ENDPOINTS_V1 } from "../constants/endpoints.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Placement Drives
 *   description: Placement drive management and analytics
 */

/**
 * @swagger
 * /placement-drives/analytics:
 *   get:
 *     summary: Fetch placement analytics
 *     tags: [Placement Drives]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Placement analytics retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or placement coordinator access required
 */
router.get(
  API_ENDPOINTS_V1.PLACEMENT_DRIVES.ANALYTICS,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  fetchPlacementAnalytics,
);

/**
 * @swagger
 * /placement-drives:
 *   get:
 *     summary: Get placement drives
 *     tags: [Placement Drives]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Placement drives retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  API_ENDPOINTS_V1.PLACEMENT_DRIVES.GET,
  authenticate,
  fetchPlacementDrives,
);

/**
 * @swagger
 * /placement-drives/{id}:
 *   get:
 *     summary: Get a placement drive by ID
 *     tags: [Placement Drives]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Placement drive ID
 *     responses:
 *       200:
 *         description: Placement drive retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Placement drive not found
 */
router.get(
  API_ENDPOINTS_V1.PLACEMENT_DRIVES.GET_BY_ID,
  authenticate,
  validate(studentIdSchema, "params"),
  fetchPlacementDriveById,
);

/**
 * @swagger
 * /placement-drives:
 *   post:
 *     summary: Create a placement drive
 *     tags: [Placement Drives]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Request body validated by createPlacementDriveSchema
 *     responses:
 *       201:
 *         description: Placement drive created successfully
 *       400:
 *         description: Invalid placement drive data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or placement coordinator access required
 */
router.post(
  API_ENDPOINTS_V1.PLACEMENT_DRIVES.CREATE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(createPlacementDriveSchema),
  addPlacementDrive,
);

/**
 * @swagger
 * /placement-drives/{id}:
 *   put:
 *     summary: Replace a placement drive
 *     tags: [Placement Drives]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Placement drive ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Complete request body validated by createPlacementDriveSchema
 *     responses:
 *       200:
 *         description: Placement drive updated successfully
 *       400:
 *         description: Invalid placement drive data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or placement coordinator access required
 *       404:
 *         description: Placement drive not found
 */
router.put(
  API_ENDPOINTS_V1.PLACEMENT_DRIVES.UPDATE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  validate(createPlacementDriveSchema),
  editPlacementDrive,
);

/**
 * @swagger
 * /placement-drives/{id}:
 *   patch:
 *     summary: Partially update a placement drive
 *     tags: [Placement Drives]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Placement drive ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields validated by updatePlacementDriveSchema
 *     responses:
 *       200:
 *         description: Placement drive updated successfully
 *       400:
 *         description: Invalid placement drive data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or placement coordinator access required
 *       404:
 *         description: Placement drive not found
 */
router.patch(
  API_ENDPOINTS_V1.PLACEMENT_DRIVES.PATCH,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  validate(updatePlacementDriveSchema),
  partiallyUpdatePlacementDrive,
);

/**
 * @swagger
 * /placement-drives/{id}:
 *   delete:
 *     summary: Delete a placement drive
 *     tags: [Placement Drives]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Placement drive ID
 *     responses:
 *       200:
 *         description: Placement drive deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or placement coordinator access required
 *       404:
 *         description: Placement drive not found
 */
router.delete(
  API_ENDPOINTS_V1.PLACEMENT_DRIVES.DELETE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  removePlacementDrive,
);

export default router;
