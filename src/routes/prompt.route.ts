import { Router } from "express";
import {
  getAllPromptsByUserController,
  insertPromptController,
} from "src/controllers/prompt.controller";
import { authenticateHttp } from "src/middleware/authentication.middleware";
import { minPower } from "src/middleware/authorization.middleware";

const router: Router = Router();

router
  .route("/me")
  .get(authenticateHttp, minPower(1), getAllPromptsByUserController);

router.route("/").post(authenticateHttp, minPower(1), insertPromptController);

export default router;
