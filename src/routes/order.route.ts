import { Router } from "express";
import { orderCreateUpdateSchema } from "schemas/orderSchemas";
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

const router: Router = Router();

const multerClient = multer();

router
  .route("/")
  .post(
    authenticate,
    minPower(1),
    validateBody(orderCreateUpdateSchema),
    createOrder
  );

router
  .route("/:id")
  .patch(
    authenticate,
    minPower(1),
    validateBody(orderCreateUpdateSchema),
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
