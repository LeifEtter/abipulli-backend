import { NextFunction, Request, Response, Router } from "express";
import { orderCreateUpdateSchema } from "validation/schemas/orderSchemas";
import validateBody from "validation/validationMiddleware";
import { createOrder, updateOrder } from "./order.controller";
import { authenticate } from "auth/authentication";
import { minPower } from "auth/authorization";
import ApiError from "error/ApiError";
import { errorMessages } from "constants/errorMessages";

const router: Router = Router();

const validateParam = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params["id"]) {
    return next(
      new ApiError({ code: 400, info: errorMessages.paramIdMissing })
    );
  }
  const paramId: number = parseInt(req.params["id"]);
  if (!paramId) {
    return next(
      new ApiError({ code: 400, info: errorMessages.paramIdMalformed })
    );
  }
  res.locals.id = paramId;
  next();
};

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

export default router;
