
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { loginSchema } from "../dtos/auth/login.dto.js";
import { registerSchema } from "../dtos/auth/register.dto.js";
import { updateProfileSchema } from "../dtos/auth/update-profile.dto.js";
import { API_ENDPOINTS_V1 } from "../constants/endpoints.js";

import {
  register,
  login,
  getMyProfile,
  updateMyProfile,
} from "../controllers/auth.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration, login, and profile management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new student
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - rollNumber
 *               - branch
 *               - year
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sakshi Deshmukh
 *               email:
 *                 type: string
 *                 format: email
 *                 example: sakshi@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *               rollNumber:
 *                 type: string
 *                 example: CSE2027001
 *               branch:
 *                 type: string
 *                 example: Computer Science
 *               year:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       201:
 *         description: Student registered successfully
 *       400:
 *         description: Invalid request data
 *       409:
 *         description: Email or roll number already exists
 */
router.post(
  API_ENDPOINTS_V1.AUTH.REGISTER,
  validate(registerSchema),
  register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in to PlaceTrack
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: sakshi@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: Login successful; returns authentication details
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Invalid credentials
 */
router.post(
  API_ENDPOINTS_V1.AUTH.LOGIN,
  validate(loginSchema),
  login
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Missing or invalid authentication token
 */
router.get(API_ENDPOINTS_V1.AUTH.PROFILE, authenticate, getMyProfile);

/**
 * @swagger
 * /auth/me:
 *   patch:
 *     summary: Update the current user's profile
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields allowed by the update profile validation schema
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sakshi Deshmukh
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               city:
 *                 type: string
 *                 example: Pune
 *               state:
 *                 type: string
 *                 example: Maharashtra
 *               pincode:
 *                 type: string
 *                 example: "411001"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Missing or invalid authentication token
 */
router.patch(
  API_ENDPOINTS_V1.AUTH.PROFILE,
  authenticate,
  validate(updateProfileSchema),
  updateMyProfile
);

export default router;
