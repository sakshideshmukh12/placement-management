
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

// Viewing interviews: logged-in users
router.get(API_ENDPOINTS_V1.INTERVIEWS.GET, authenticate, getAllInterviews);

router.get(
  API_ENDPOINTS_V1.INTERVIEWS.GET_BY_ID,
  authenticate,
  validate(studentIdSchema, "params"),
  getInterview,
);

// Managing interviews: ADMIN and PLACEMENT_COORDINATOR
router.post(
  API_ENDPOINTS_V1.INTERVIEWS.CREATE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(createInterviewSchema),
  addInterview,
);

router.put(
  API_ENDPOINTS_V1.INTERVIEWS.UPDATE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  validate(createInterviewSchema),
  updateInterviewDetails,
);

router.patch(
  API_ENDPOINTS_V1.INTERVIEWS.PATCH,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  validate(updateInterviewSchema),
  patchInterviewDetails,
);

router.delete(
  API_ENDPOINTS_V1.INTERVIEWS.DELETE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  removeInterview,
);

export default router;
