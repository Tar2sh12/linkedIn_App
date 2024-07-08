import { Router } from "express";
import { errorHandler } from "../../middleware/error-handling.middleware.js";
import { authorizationMiddleware } from "../../middleware/authorization.middleware.js";
import { roles, systemRoles } from "../../utils/system-roles.utils.js";
import * as jobs from "./job.conrtoller.js";
import { auth } from "../../middleware/authentication.middleware.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { addJobSchema, applySchema, getJobsByCompanyNameSchema, getJobsSchema } from "./job.schema.js";

const router = Router();
router.post(
  "/addJob",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
  errorHandler(validationMiddleware(addJobSchema)),
  errorHandler(jobs.addJob)
);
router.post(
    "/applyToJob/:_id",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.USER)),
    errorHandler(validationMiddleware(applySchema)),
    errorHandler(jobs.applyToJob)
  );
// router.put(
//   "/updateCompany/:_id",
//   errorHandler(auth()),
//   errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
//   errorHandler(validationMiddleware(updateCompanySchema)),
//   errorHandler(companies.updateCompany)
// );
// router.delete(
//   "/deleteCompany/:_id",
//   errorHandler(auth()),
//   errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
//   errorHandler(validationMiddleware(deleteCompanySchema)),
//   errorHandler(companies.deleteCompany)
// );
router.get(
  "/getJobs",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(roles.USER_COMPANY_HR)),
  errorHandler(validationMiddleware(getJobsSchema)),
  errorHandler(jobs.jobWithCompany)
);
router.get(
  "/getJobsByCompanyName",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(roles.USER_COMPANY_HR)),
  errorHandler(validationMiddleware(getJobsByCompanyNameSchema)),
  errorHandler(jobs.getJobsByCompanyName)
);
router.get(
    "/getJobsByCompanyName",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(roles.USER_COMPANY_HR)),
    errorHandler(jobs.getJobsByCompanyName)
  );
export default router;
