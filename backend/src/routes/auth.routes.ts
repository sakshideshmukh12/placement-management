
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
router.post(
  API_ENDPOINTS_V1.AUTH.REGISTER,
  validate(registerSchema),
  register
);

router.post(
  API_ENDPOINTS_V1.AUTH.LOGIN,
  validate(loginSchema),
  login
);

router.get(API_ENDPOINTS_V1.AUTH.PROFILE, authenticate, getMyProfile);
router.patch(
  API_ENDPOINTS_V1.AUTH.PROFILE,
  authenticate,
  validate(updateProfileSchema),
  updateMyProfile
);

export default router;
