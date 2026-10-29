
import { Router } from "express";

import {
  addCompany,
  editComapny,
  fetchCompanies,
  partialUpdateCompany,
  fetchCompanyById,
  removeCompany,
} from "../controllers/company.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

import { createCompanySchema } from "../dtos/company/create-company.dto.js";
import { updateCompanySchema } from "../dtos/company/update-company.dto.js";
import { studentIdSchema } from "../dtos/student/student-id.dto.js";
import { UserRole } from "../constants/roles.js";
import { API_ENDPOINTS_V1 } from "../constants/endpoints.js"; 



const router = Router();

router.post(
  API_ENDPOINTS_V1.COMPANIES.CREATE   ,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(createCompanySchema),
  addCompany,
);

router.get("/companies", authenticate, fetchCompanies);

router.put(
  API_ENDPOINTS_V1.COMPANIES.UPDATE,
  authenticate,
   authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  validate(createCompanySchema),
  editComapny,
);

router.patch(
  API_ENDPOINTS_V1.COMPANIES.UPDATE,
  authenticate,
   authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  validate(updateCompanySchema),
  partialUpdateCompany,
);

router.get(
  API_ENDPOINTS_V1.COMPANIES.GET,
  authenticate,
  validate(studentIdSchema, "params"),
  fetchCompanyById,
);

router.delete(
  API_ENDPOINTS_V1.COMPANIES.DELETE,
  authenticate,
   authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  removeCompany,
);

export default router;
