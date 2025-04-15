import { Router } from "express";
import { loginWithEmail, registerUser } from "./user.controller";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../../validation/schemas/userSchemas";
import validateBody from "../../validation/validationMiddleware";

const router: Router = Router();

router
  .route("/register")
  .post(validateBody(userRegistrationSchema), registerUser);

router.route("/login").post(validateBody(userLoginSchema), loginWithEmail);

export default router;
