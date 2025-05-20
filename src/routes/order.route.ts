import { Router } from "express";
import { validateBody, validateParams } from "middleware/validation.middleware";
import { authenticate } from "middleware/authentication.middleware";
import { minPower } from "middleware/authorization.middleware";
import designRouter from "./design.route";
import multer from "multer";
import {
  createOrder,
  deleteOrder,
  updateOrder,
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
    createOrder
  );

router
  .route("/:id")
  .patch(
    authenticate,
    minPower(1),
    validateBody(OrderUpdateSchema),
    validateParams({ requiredParams: ["id"] }),
    updateOrder
  );

router
  .route("/:id")
  .delete(
    authenticate,
    minPower(1),
    validateParams({ requiredParams: ["id"] }),
    deleteOrder
  );

router.use("/:orderId/design", designRouter);

export default router;
