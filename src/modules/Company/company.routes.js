import { Router } from "express";
import { errorHandler } from "../../middleware/error-handling.middleware.js";
import { authorizationMiddleware } from "../../middleware/authorization.middleware.js";
import { systemRoles } from "../../utils/system-roles.utils.js";
import * as companies from "./company.conrtoller.js";
import { auth } from "../../middleware/authentication.middleware.js";

const router = Router();
router.post(
  "/addCompany",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
  errorHandler(companies.addCompany)
);
export default router;
