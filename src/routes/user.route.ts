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
import { authenticate } from "src/middleware/authentication.middleware";
import { minPower } from "src/middleware/authorization.middleware";
import { UserCreateSchema, UserLoginSchema } from "abipulli-types";
const router: Router = Router();

/**
 * @openapi
 * /user/authenticate:
 *   get:
 *     summary: Check if the user is authenticated
 *     description: Check if the user is authenticated by validating the jwt_token in httpOnly cookies
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: User is authenticated
 *       '401':
 *         description: Invalid or missing authentication token
 *
 */
router.route("/authenticate").get(authenticate, checkTokenController);

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
  .post(validateBody(UserCreateSchema), registerUserController);

router
  .route("/login")
  .post(validateBody(UserLoginSchema), loginWithEmailController);

// router
//   .route("/anonymous")
//   .post(validateBody(anonymousLoginSchema), signInAnonymous);

// router
//   .route("/googleSignOn")
//   .post(validateBody(googleSignOnSchema), googleSSOLogin);

router
  .route("/:userId")
  .delete(
    authenticate,
    minPower(10),
    validateParams({ requiredParams: ["userId"] }),
    deleteUserController
  );

router.route("/").delete(authenticate, minPower(1), deleteUserSelfController);

router.route("/me").get(authenticate, minPower(1), getUserDataController);

router.route("/").get(authenticate, minPower(10), getAllUsersController);

router
  .route("/me/password")
  .patch(authenticate, minPower(1), changeUserPasswordController);

export default router;
