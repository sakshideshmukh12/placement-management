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
import { updateStudentSchema,replaceStudentSchema } from "../dtos/student/update-student.dto.js";
import { UserRole } from "../constants/roles.js";
import { API_ENDPOINTS_V1 } from "../constants/endpoints.js";
const router = express.Router();

// View all students: Admin and Placement Coordinator only
router.get(
  API_ENDPOINTS_V1.STUDENTS.GET ,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentQuerySchema,"query"),
  getStudents
);

// Add a student: Admin and Placement Coordinator only
router.post(
  API_ENDPOINTS_V1.STUDENTS.CREATE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(createStudentSchema),
  addStudent
);

// View a student: Admin/Coordinator can view any; student can view their own
router.get(
  API_ENDPOINTS_V1.STUDENTS.GET_BY_ID,
  authenticate,
  authorizeStudentAccess,
  validate(studentIdSchema,"params"),
  getStudentById
);

// Update a student: Admin/Coordinator can update any; student can access their own
router.put(
  API_ENDPOINTS_V1.STUDENTS.UPDATE,
  authenticate,
  validate(studentIdSchema,"params"),
  authorizeStudentAccess,
  validate(replaceStudentSchema),
  updateStudent
);

router.patch(
  API_ENDPOINTS_V1.STUDENTS.PATCH,
  authenticate,
  validate(studentIdSchema,"params"),
  authorizeStudentAccess,
  validate(updateStudentSchema),
  patchStudent
);

// Delete a student: Admin and Placement Coordinator only
router.delete(
  API_ENDPOINTS_V1.STUDENTS.DELETE,
  authenticate,
  validate(studentIdSchema,"params"),
  authenticate,
  validate(studentIdSchema,"params"),
    authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  deleteStudentById
);


router.get("/test-error", testError);

export default router;