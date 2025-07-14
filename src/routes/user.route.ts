import { Router } from "express";
import {
  changeUserPasswordController,
  checkTokenController,
  deleteUserController,
  deleteUserSelfController,
  getAllUsersController,
  getUserDataController,
  loginWithEmailController,
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

/**
 * @openapi
 * /user/authenticateHttp:
 *   get:
 *     summary: Check if the user is authenticateHttpd
 *     description: Check if the user is authenticateHttpd by validating the jwt_token in httpOnly cookies
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: User is authenticateHttpd
 *       '401':
 *         description: Invalid or missing authentication token
 *
 */
router.route("/authenticate").get(authenticateHttp, checkTokenController);

/**
 * @openapi
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the given email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user (minimum 6 characters, must contain at least one special character)
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Invalid request body
 *       '409':
 *         description: User already exists
 */
router
  .route("/register")
  .post(validateBody(UserCreateParamsSchema), registerUserController);

router
  .route("/login")
  .post(validateBody(UserLoginParamsSchema), loginWithEmailController);

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
