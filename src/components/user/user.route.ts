import { Router, Request, Response, NextFunction } from "express";
import {
  deleteUser,
  deleteUserSelf,
  googleSSOLogin,
  loginWithEmail,
  registerUser,
  signInAnonymous,
} from "./user.controller";
import {
  anonymousLoginSchema,
  googleSignOnSchema,
  userLoginSchema,
  userRegistrationSchema,
} from "../../validation/schemas/userSchemas";
import {
  validateBody,
  validateParams,
} from "../../validation/validationMiddleware";
import { authenticate } from "auth/authentication";
import { minPower } from "auth/authorization";
const router: Router = Router();

router
  .route("/register")
  .post(validateBody(userRegistrationSchema), registerUser);

router.route("/login").post(validateBody(userLoginSchema), loginWithEmail);

router
  .route("/anonymous")
  .post(validateBody(anonymousLoginSchema), signInAnonymous);

router
  .route("/googleSignOn")
  .post(validateBody(googleSignOnSchema), googleSSOLogin);

router
  .route("/:userId")
  .delete(
    authenticate,
    minPower(10),
    validateParams({ requiredParams: ["userId"] }),
    deleteUser
  );

router.route("/").delete(authenticate, minPower(1), deleteUserSelf);

export default router;
