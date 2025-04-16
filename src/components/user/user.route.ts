import { Router } from "express";
import {
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
import validateBody from "../../validation/validationMiddleware";

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

export default router;
