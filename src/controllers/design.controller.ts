import { designs, InsertDesign } from "src/db/index";
import { NextFunction, Request, Response } from "express";
import {
  DesignCreateParams,
  DesignsResponse,
  errorMessages,
  Order,
} from "abipulli-types";
import { ApiError } from "src/error/ApiError";
import { getDb } from "src/db/db";
import {
  getDesignById,
  getDesignsByUserId,
  getDesignsForOrder,
} from "src/services/designs/getDesigns.service";
import { getOrderById } from "src/services/orders/getOrderById.service";

export const getAllUserDesignsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: number = res.locals.user.user_id;

    const designs = await getDesignsByUserId(userId);
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
    const createdDesigns = await getDb()
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
    if (!design) return next(ApiError.notFound({ resource: "Design" }));
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
    if (!order) return next(ApiError.notFound({ resource: "Order" }));
    // if (order.customerId != userId)
    //   return next(ApiError.notOwned({ resource: "Order" }));
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
