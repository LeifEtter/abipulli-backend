import { ChatCreateSchema } from "abipulli-types";
import { Router } from "express";
import {
  createChatController,
  getChatController,
} from "src/controllers/chat.controller";
import { authenticateHttp } from "src/middleware/authentication.middleware";
import { minPower } from "src/middleware/authorization.middleware";
import {
  validateBody,
  validateParams,
} from "src/middleware/validation.middleware";

const router = Router({ mergeParams: true });
// Allow initial message
router
  .route("/")
  .post(
    authenticateHttp,
    minPower(1),
    validateBody(ChatCreateSchema),
    createChatController
  );

router
  .route("/:chatId")
  .get(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["chatId"] }),
    getChatController
  );

export default router;
