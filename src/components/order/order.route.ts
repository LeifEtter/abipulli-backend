import { NextFunction, Request, Response, Router } from "express";
import { orderCreateUpdateSchema } from "validation/schemas/orderSchemas";
import { validateBody, validateParam } from "validation/validationMiddleware";
import { createOrder, deleteOrder, updateOrder } from "./order.controller";
import { authenticate } from "auth/authentication";
import { minPower } from "auth/authorization";

const router: Router = Router();

router
  .route("/create")
  .post(
    authenticate,
    minPower(1),
    validateBody(orderCreateUpdateSchema),
    createOrder
  );

router
  .route("/update/:id")
  .patch(
    authenticate,
    minPower(1),
    validateBody(orderCreateUpdateSchema),
    validateParam,
    updateOrder
  );

router
  .route("/delete/:id")
  .delete(authenticate, minPower(1), validateParam, deleteOrder);

export default router;
