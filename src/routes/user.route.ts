import { Router } from "express";
import {
  changeUserPasswordController,
  checkTokenController,
  deleteUserController,
  deleteUserSelfController,
  getAllUsersController,
  getUserDataController,
  loginWithEmailController,
  logoutController,
  registerUserController,
} from "../controllers/user.controller";
import {
  validateBody,
  validateParams,
} from "../middleware/validation.middleware";
import { authenticateHttp } from "src/middleware/authentication.middleware";
import { minPower } from "src/middleware/authorization.middleware";
import {
  UserChangePasswordParamsSchema,
  UserCreateParamsSchema,
  UserLoginParamsSchema,
} from "abipulli-types";
const router: Router = Router();

router.route("/authenticate").get(authenticateHttp, checkTokenController);

router
  .route("/register")
  .post(validateBody(UserCreateParamsSchema), registerUserController);

router
  .route("/login")
  .post(validateBody(UserLoginParamsSchema), loginWithEmailController);

router.route("/logout").get(authenticateHttp, minPower(1), logoutController);

// router
//   .route("/anonymous")
//   .post(validateBody(anonymousLoginSchema), signInAnonymous);

// router
//   .route("/googleSignOn")
//   .post(validateBody(googleSignOnSchema), googleSSOLogin);

router
  .route("/:userId")
  .delete(
    authenticateHttp,
    minPower(10),
    validateParams({ requiredParams: ["userId"] }),
    deleteUserController
  );

router
  .route("/")
  .delete(authenticateHttp, minPower(1), deleteUserSelfController);

router.route("/me").get(authenticateHttp, minPower(1), getUserDataController);

router.route("/").get(authenticateHttp, minPower(10), getAllUsersController);

router
  .route("/me/password")
  .patch(
    authenticateHttp,
    minPower(1),
    validateBody(UserChangePasswordParamsSchema),
    changeUserPasswordController
  );

export default router;
