import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "src/middleware/validation.middleware";
import { authenticateHttp } from "src/middleware/authentication.middleware";
import { minPower } from "src/middleware/authorization.middleware";
import designRouter from "./design.route";
import {
  createOrderController,
  deleteOrderController,
  getAllOrdersController,
  updateOrderController,
} from "src/controllers/order.controller";
import { createChatForOrderController } from "src/controllers/chat.controller";
import {
  ChatCreateParamsSchema,
  OrderCreateParamsSchema,
  OrderUpdateParamsSchema,
} from "abipulli-types";

const router: Router = Router();

router
  .route("/")
  .post(
    authenticateHttp,
    minPower(1),
    validateBody(OrderCreateParamsSchema),
    createOrderController
  );

router.route("/").get(authenticateHttp, minPower(1), getAllOrdersController);

router
  .route("/:id")
  .patch(
    authenticateHttp,
    minPower(1),
    validateBody(OrderUpdateParamsSchema),
    validateParams({ requiredParams: ["id"] }),
    updateOrderController
  );

router
  .route("/:id")
  .delete(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["id"] }),
    deleteOrderController
  );

router.use("/:orderId/design", designRouter);

router.use(
  "/:orderId/chat",
  authenticateHttp,
  minPower(1),
  validateParams({ requiredParams: ["orderId"] }),
  validateBody(ChatCreateParamsSchema),
  createChatForOrderController
);

export default router;
