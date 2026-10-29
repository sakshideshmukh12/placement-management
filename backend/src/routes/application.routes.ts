
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

router.post(
  API_ENDPOINTS_V1.APPLICATIONS.CREATE,

  authenticate,
  authorizeRoles(UserRole.STUDENT),
  validate(createApplicationSchema),
  addApplication,
);

// Fetch all applications, filtered by the logged-in user's role.
router.get(
  API_ENDPOINTS_V1.APPLICATIONS.GET_ALL,
  authenticate,
  getApplication,
);

// Keep the existing single-application endpoint.
router.get(
  API_ENDPOINTS_V1.APPLICATIONS.GET,
  authenticate,
  getApplication,
);
router.patch(
  API_ENDPOINTS_V1.APPLICATIONS.UPDATE,
  authenticate,
  authorizeRoles(UserRole.PLACEMENT_COORDINATOR, UserRole.ADMIN),
  validate(studentIdSchema, "params"),
  validate(updateApplicationSchema),
  changeApplicationStatus,
);

export default router;
