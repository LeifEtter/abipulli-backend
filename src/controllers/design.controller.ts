import { designs, InsertDesign } from "src/db/index";
import { NextFunction, Request, Response } from "express";
import {
  DesignCreateParams,
  DesignsResponse,
  errorMessages,
  Order,
} from "abipulli-types";
import { ApiError } from "src/error/ApiError";
import db from "src/db/db";
import {
  getDesignById,
  getDesignsForOrder,
} from "src/services/designs/getDesigns.service";
import { getOrderById } from "src/services/orders/getOrderById.service";

export const createDesignController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body as DesignCreateParams;
    const design: InsertDesign = {
      order_id: res.locals.params.orderId!,
      customer_id: res.locals.user.user_id,
      ...req.body,
    };
    const createdDesigns = await db
      .insert(designs)
      .values(design)
      .returning({ id: designs.id });
    res.status(201).send({ design_id: createdDesigns[0]!.id });
  } catch (error) {
    next(error);
  }
};

export const retrieveDesignController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const designId: number = res.locals.params.designId!;
    const design = await getDesignById(designId);
    if (!design) {
      return next(
        new ApiError({
          code: 404,
          info: errorMessages.resourceNotFound,
          resource: "Design",
        })
      );
    }
    res.json(design);
  } catch (error) {
    next(error);
  }
};

export const getDesignsForOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check for correct user id in order
    const orderId: number = res.locals.params.orderId!;
    const userId: number = res.locals.params.userId!;

    const order: Order | undefined = await getOrderById(orderId);
    if (!order) {
      return next(
        new ApiError({
          code: 404,
          info: errorMessages.resourceNotFound,
          resource: "Order",
        })
      );
    }
    if (order.customerId != userId) {
      return next(
        new ApiError({
          code: 401,
          info: errorMessages.resourceNotOwned,
          resource: "Order",
        })
      );
    }
    const designs = await getDesignsForOrder(orderId);
    const designResponse: DesignsResponse = {
      success: true,
      data: {
        items: designs,
        total: designs.length,
        page: 1,
        pageSize: designs.length,
      },
    };
    res.status(200).json(designResponse);
  } catch (error) {
    next(error);
  }
};
