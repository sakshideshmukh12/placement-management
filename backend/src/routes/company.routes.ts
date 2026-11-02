
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

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company management APIs
 */

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a company
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Company details required by createCompanySchema
 *             example:
 *               name: Tech Solutions
 *               description: Software development company
 *               website: https://example.com
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Invalid company details
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  API_ENDPOINTS_V1.COMPANIES.CREATE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(createCompanySchema),
  addCompany,
);

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get("/companies", authenticate, fetchCompanies);

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Replace company details
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Complete company details required by createCompanySchema
 *             example:
 *               name: Tech Solutions
 *               description: Updated company description
 *               website: https://example.com
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       400:
 *         description: Invalid company details or ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Company not found
 */
router.put(
  API_ENDPOINTS_V1.COMPANIES.UPDATE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  validate(createCompanySchema),
  editComapny,
);

/**
 * @swagger
 * /companies/{id}:
 *   patch:
 *     summary: Partially update company details
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update, validated by updateCompanySchema
 *             example:
 *               name: Updated Tech Solutions
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       400:
 *         description: Invalid update data or ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Company not found
 */
router.patch(
  API_ENDPOINTS_V1.COMPANIES.UPDATE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  validate(updateCompanySchema),
  partialUpdateCompany,
);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company retrieved successfully
 *       400:
 *         description: Invalid company ID
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Company not found
 */
router.get(
  API_ENDPOINTS_V1.COMPANIES.GET,
  authenticate,
  validate(studentIdSchema, "params"),
  fetchCompanyById,
);

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       400:
 *         description: Invalid company ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Company not found
 */
router.delete(
  API_ENDPOINTS_V1.COMPANIES.DELETE,
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.PLACEMENT_COORDINATOR),
  validate(studentIdSchema, "params"),
  removeCompany,
);

export default router;
