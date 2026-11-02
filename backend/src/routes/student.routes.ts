
import express from "express";

import { validate } from "../middleware/validate.middleware.js";
import { createStudentSchema } from "../dtos/student/create-student.dto.js";

import {
  addStudent,
  deleteStudentById,
  getStudentById,
  getStudents,
  patchStudent,
  testError,
  updateStudent,
} from "../controllers/student.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { authorizeStudentAccess } from "../middleware/studentAccess.middleware.js";
import { studentQuerySchema } from "../dtos/student/student-query.dto.js";
import { studentIdSchema } from "../dtos/student/student-id.dto.js";
import {
  updateStudentSchema,
  replaceStudentSchema,
} from "../dtos/student/update-student.dto.js";
import { UserRole } from "../constants/roles.js";
import { API_ENDPOINTS_V1 } from "../constants/endpoints.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student record management
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of students per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search students
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or placement coordinator access required
 */
router.get(
  API_ENDPOINTS_V1.STUDENTS.GET,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentQuerySchema, "query"),
  getStudents
);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Add a student
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudent'
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Invalid student data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or placement coordinator access required
 *       409:
 *         description: Student already exists
 */
router.post(
  API_ENDPOINTS_V1.STUDENTS.CREATE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(createStudentSchema),
  addStudent
);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student not found
 */
router.get(
  API_ENDPOINTS_V1.STUDENTS.GET_BY_ID,
  authenticate,
  authorizeStudentAccess,
  validate(studentIdSchema, "params"),
  getStudentById
);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Replace a student record
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Complete student data accepted by replaceStudentSchema
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Invalid student data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student not found
 */
router.put(
  API_ENDPOINTS_V1.STUDENTS.UPDATE,
  authenticate,
  validate(studentIdSchema, "params"),
  authorizeStudentAccess,
  validate(replaceStudentSchema),
  updateStudent
);

/**
 * @swagger
 * /students/{id}:
 *   patch:
 *     summary: Partially update a student record
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields accepted by updateStudentSchema
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Invalid student data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student not found
 */
router.patch(
  API_ENDPOINTS_V1.STUDENTS.PATCH,
  authenticate,
  validate(studentIdSchema, "params"),
  authorizeStudentAccess,
  validate(updateStudentSchema),
  patchStudent
);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin or placement coordinator access required
 *       404:
 *         description: Student not found
 */
router.delete(
  API_ENDPOINTS_V1.STUDENTS.DELETE,
  authenticate,
  validate(studentIdSchema, "params"),
  authenticate,
  validate(studentIdSchema, "params"),
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  deleteStudentById
);

/**
 * @swagger
 * /test-error:
 *   get:
 *     summary: Test centralized error handling
 *     tags: [Students]
 *     responses:
 *       500:
 *         description: Test error response
 */
router.get("/test-error", testError);

export default router;
