
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

// Placement analytics: ADMIN and PLACEMENT_COORDINATOR
// Keep this route before "/placement-drives/:id".
router.get(
  API_ENDPOINTS_V1.PLACEMENT_DRIVES.ANALYTICS,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  fetchPlacementAnalytics,
);

// Viewing placement drives: logged-in users
router.get(
  API_ENDPOINTS_V1.PLACEMENT_DRIVES.GET,
  authenticate,
  fetchPlacementDrives,
);

router.get(
  API_ENDPOINTS_V1.PLACEMENT_DRIVES.GET_BY_ID,
  authenticate,
  validate(studentIdSchema, "params"),
  fetchPlacementDriveById,
);

// Managing placement drives: ADMIN and PLACEMENT_COORDINATOR
router.post(
  API_ENDPOINTS_V1.PLACEMENT_DRIVES.CREATE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(createPlacementDriveSchema),
  addPlacementDrive,
);

router.put(
  API_ENDPOINTS_V1.PLACEMENT_DRIVES.UPDATE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  validate(createPlacementDriveSchema),
  editPlacementDrive,
);

router.patch(
  API_ENDPOINTS_V1.PLACEMENT_DRIVES.PATCH,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  validate(updatePlacementDriveSchema),
  partiallyUpdatePlacementDrive,
);

router.delete(
  API_ENDPOINTS_V1.PLACEMENT_DRIVES.DELETE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  removePlacementDrive,
);

export default router;
