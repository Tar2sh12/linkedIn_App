import { Router } from "express";
import { errorHandler } from "../../middleware/error-handling.middleware.js";
import { authorizationMiddleware } from "../../middleware/authorization.middleware.js";
import { roles, systemRoles } from "../../utils/system-roles.utils.js";
import * as jobs from "./job.conrtoller.js";
import { auth } from "../../middleware/authentication.middleware.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { addJobSchema, applySchema, deleteJobSchema, filterSchema, getJobsByCompanyNameSchema, getJobsSchema, updateJobSchema } from "./job.schema.js";

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
router.put(
  "/update/:_id",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
  errorHandler(validationMiddleware(updateJobSchema)),
  errorHandler(jobs.updateJob)
);
router.delete(
  "/delete/:_id",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
  errorHandler(validationMiddleware(deleteJobSchema)),
  errorHandler(jobs.deleteJob)
);
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
    "/filter",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(roles.USER_COMPANY_HR)),
    errorHandler(validationMiddleware(filterSchema)),
    errorHandler(jobs.filter)
  );
export default router;
