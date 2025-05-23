import { Router } from "express";
import { validateBody, validateParams } from "middleware/validation.middleware";
import { authenticate } from "middleware/authentication.middleware";
import { minPower } from "middleware/authorization.middleware";
import designRouter from "./design.route";
import multer from "multer";
import {
  createOrderController,
  deleteOrderController,
  updateOrderController,
} from "controllers/order.controller";
import { OrderCreateSchema, OrderUpdateSchema } from "abipulli-types";

const router: Router = Router();

const multerClient = multer();

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
