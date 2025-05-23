import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "src/middleware/validation.middleware";
import { authenticate } from "src/middleware/authentication.middleware";
import { minPower } from "src/middleware/authorization.middleware";
import designRouter from "./design.route";
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
    authenticate,
    minPower(1),
    validateBody(OrderCreateSchema),
    createOrderController
  );

router
  .route("/:id")
  .patch(
    authenticate,
    minPower(1),
    validateBody(OrderUpdateSchema),
    validateParams({ requiredParams: ["id"] }),
    updateOrderController
  );

router
  .route("/:id")
  .delete(
    authenticate,
    minPower(1),
    validateParams({ requiredParams: ["id"] }),
    deleteOrderController
  );

router.use("/:orderId/design", designRouter);

export default router;
