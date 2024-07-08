import { Router } from "express";
import { errorHandler } from "../../middleware/error-handling.middleware.js";
import * as users from "./user.conrtoller.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import {
  deleteSchema,
  getByIdSchema,
  getInfoSchema,
  logInSchema,
  logOutSchema,
  recoveryEmailSchema,
  SignUpSchema,
  updatePassSchema,
  updateSchema,
} from "./user.schema.js";
import { auth } from "../../middleware/authentication.middleware.js";
const router = Router();
router.post(
  "/signUp",
  errorHandler(validationMiddleware(SignUpSchema)),
  errorHandler(users.signUp)
);
router.post(
  "/login",
  errorHandler(validationMiddleware(logInSchema)),
  errorHandler(users.login)
);
router.patch(
  "/logout",
  errorHandler(auth()),
  errorHandler(validationMiddleware(logOutSchema)),
  errorHandler(users.logOut)
);
router.put(
  "/update",
  errorHandler(auth()),
  errorHandler(validationMiddleware(updateSchema)),
  errorHandler(users.updateUser)
);
router.delete(
  "/delete",
  errorHandler(auth()),
  errorHandler(validationMiddleware(deleteSchema)),
  errorHandler(users.deleteUser)
);
router.get(
  "/getInfo",
  errorHandler(auth()),
  errorHandler(validationMiddleware(getInfoSchema)),
  errorHandler(users.getInfo)
);
router.get(
  "/getById/:_id",
  errorHandler(validationMiddleware(getByIdSchema)),
  errorHandler(users.getById)
);
router.patch(
  "/updatePass",
  errorHandler(auth()),
  errorHandler(validationMiddleware(updatePassSchema)),
  errorHandler(users.updatePass)
);
router.get("/recoveryEmail",
    errorHandler(validationMiddleware(recoveryEmailSchema)),
    errorHandler(users.getAllRecovery)
)
export default router;
