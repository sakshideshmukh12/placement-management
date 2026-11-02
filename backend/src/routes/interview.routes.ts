
import { Router } from "express";

import {
  addInterview,
  getAllInterviews,
  getInterview,
  updateInterviewDetails,
  patchInterviewDetails,
  removeInterview,
} from "../controllers/interview.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { createInterviewSchema } from "../dtos/interview/create-interview.dto.js";
import { updateInterviewSchema } from "../dtos/interview/update-interview.dto.js";
import { studentIdSchema } from "../dtos/student/student-id.dto.js";
import { UserRole } from "../constants/roles.js";
import { API_ENDPOINTS_V1 } from "../constants/endpoints.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Interviews
 *   description: Interview scheduling and management
 */

/**
 * @swagger
 * /interviews:
 *   get:
 *     summary: Get all interviews
 *     tags: [Interviews]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Interviews retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(API_ENDPOINTS_V1.INTERVIEWS.GET, authenticate, getAllInterviews);

/**
 * @swagger
 * /interviews/{id}:
 *   get:
 *     summary: Get an interview by ID
 *     tags: [Interviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Interview ID
 *     responses:
 *       200:
 *         description: Interview retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Interview not found
 */
router.get(
  API_ENDPOINTS_V1.INTERVIEWS.GET_BY_ID,
  authenticate,
  validate(studentIdSchema, "params"),
  getInterview,
);

/**
 * @swagger
 * /interviews:
 *   post:
 *     summary: Schedule an interview
 *     tags: [Interviews]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Request body validated by createInterviewSchema
 *     responses:
 *       201:
 *         description: Interview scheduled successfully
 *       400:
 *         description: Invalid interview data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or placement coordinator access required
 */
router.post(
  API_ENDPOINTS_V1.INTERVIEWS.CREATE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(createInterviewSchema),
  addInterview,
);

/**
 * @swagger
 * /interviews/{id}:
 *   put:
 *     summary: Replace interview details
 *     tags: [Interviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Interview ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Complete request body validated by createInterviewSchema
 *     responses:
 *       200:
 *         description: Interview updated successfully
 *       400:
 *         description: Invalid interview data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or placement coordinator access required
 *       404:
 *         description: Interview not found
 */
router.put(
  API_ENDPOINTS_V1.INTERVIEWS.UPDATE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  validate(createInterviewSchema),
  updateInterviewDetails,
);

/**
 * @swagger
 * /interviews/{id}:
 *   patch:
 *     summary: Partially update interview details
 *     tags: [Interviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Interview ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields validated by updateInterviewSchema
 *     responses:
 *       200:
 *         description: Interview updated successfully
 *       400:
 *         description: Invalid interview data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or placement coordinator access required
 *       404:
 *         description: Interview not found
 */
router.patch(
  API_ENDPOINTS_V1.INTERVIEWS.PATCH,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  validate(updateInterviewSchema),
  patchInterviewDetails,
);

/**
 * @swagger
 * /interviews/{id}:
 *   delete:
 *     summary: Delete an interview
 *     tags: [Interviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Interview ID
 *     responses:
 *       200:
 *         description: Interview deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or placement coordinator access required
 *       404:
 *         description: Interview not found
 */
router.delete(
  API_ENDPOINTS_V1.INTERVIEWS.DELETE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  removeInterview,
);

export default router;
