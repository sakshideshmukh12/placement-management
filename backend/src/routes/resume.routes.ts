
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import resumeUpload from "../middleware/resumeUpload.js";
import {
  uploadResume,
  downloadResume,
} from "../controllers/resume.controller.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Resume
 *   description: Student resume upload and download APIs
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a student resume
 *     description: Uploads a resume file for the authenticated student.
 *     tags: [Resume]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume file to upload
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 *       400:
 *         description: Missing file, invalid file, or upload failed
 *       401:
 *         description: Authentication required or token invalid
 *       403:
 *         description: Only students can upload resumes
 */
router.post(
  "/upload",
  authenticate,
  authorizeRoles("STUDENT"),
  resumeUpload.single("resume"),
  uploadResume,
);

/**
 * @swagger
 * /download:
 *   get:
 *     summary: Download the authenticated student's resume
 *     description: Downloads the resume associated with the authenticated user.
 *     tags: [Resume]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Resume file returned successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Authentication required or token invalid
 *       404:
 *         description: Resume not found
 */
router.get(
  "/download",
  authenticate,
  downloadResume,
);

export default router;
