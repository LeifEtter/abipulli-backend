import { Router } from "express";
import { createChatController } from "src/controllers/chat.controller";
import { authenticateHttp } from "src/middleware/authentication.middleware";
import { minPower } from "src/middleware/authorization.middleware";
import { validateParams } from "src/middleware/validation.middleware";
const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    authenticateHttp,
    minPower(2),
    validateParams({ requiredParams: ["orderId"] }),
    createChatController
  );

export default router;
