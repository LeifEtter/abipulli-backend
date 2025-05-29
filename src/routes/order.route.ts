import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "src/middleware/validation.middleware";
import { authenticateHttp } from "src/middleware/authentication.middleware";
import { minPower } from "src/middleware/authorization.middleware";
import designRouter from "./design.route";
import chatRouter from "./chat.route";
import {
  createOrderController,
  deleteOrderController,
  updateOrderController,
} from "src/controllers/order.controller";
import { OrderCreateSchema, OrderUpdateSchema } from "abipulli-types";

const router: Router = Router();

router
  .route("/")
  .post(
    authenticateHttp,
    minPower(1),
    validateBody(OrderCreateSchema),
    createOrderController
  );

router
  .route("/:id")
  .patch(
    authenticateHttp,
    minPower(1),
    validateBody(OrderUpdateSchema),
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

router.use("/:orderId/chat", chatRouter);

export default router;
