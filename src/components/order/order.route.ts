import { NextFunction, Request, Response, Router } from "express";
import { orderCreateUpdateSchema } from "validation/schemas/orderSchemas";
import { validateBody, validateParams } from "validation/validationMiddleware";
import { createOrder, deleteOrder, updateOrder } from "./order.controller";
import { authenticate } from "auth/authentication";
import { minPower } from "auth/authorization";
import { saveImage } from "components/image/image.controller";
import multer from "multer";

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
  .route("/:id/image")
  .post(
    authenticate,
    minPower(1),
    validateParams({ requiredParams: ["id"] }),
    multerClient.single("image"),
    saveImage
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

export default router;
