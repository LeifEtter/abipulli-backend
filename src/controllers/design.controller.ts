import { designs, InsertDesign } from "src/db/index";
import { NextFunction, Request, Response } from "express";
import {
  Design,
  DesignCreateParams,
  DesignResponse,
  DesignsResponse,
  errorMessages,
  ImageWithPositionAndScale,
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
import { deleteDesignById } from "src/services/designs/deleteDesign.service";
import { getImagesByDesignId } from "src/services/images/getImageById.service";
import { duplicateDesign } from "src/services/designs/duplicateDesign.service";

export const getAllUserDesignsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId: number = res.locals.user.user_id;

    const designsWithoutImages = await getDesignsByUserId(userId);
    const designs = [];
    for (const design of designsWithoutImages) {
      const images: ImageWithPositionAndScale[] = await getImagesByDesignId(
        design.id,
      );
      design.images = images;
      designs.push(design);
    }
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
  next: NextFunction,
) => {
  try {
    const body = req.body as DesignCreateParams;
    const design: InsertDesign = {
      order_id: res.locals.params.orderId!,
      customer_id: res.locals.user.user_id,
      preferred_pullover_id: body.preferredPulloverId,
    };
    const result = await getDb()
      .insert(designs)
      .values(design)
      .returning({ id: designs.id });
    if (!result[0])
      return next(
        new ApiError({
          code: 400,
          info: "Couldn't create design",
          resource: "Design",
        }),
      );
    const createdDesign: Design | undefined = await getDesignById(result[0].id);
    const response: DesignResponse = { data: createdDesign, success: true };
    res.status(201).send(response);
  } catch (error) {
    next(error);
  }
};

export const retrieveDesignController = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
  next: NextFunction,
) => {
  try {
    // check for correct user id in order
    const orderId: number = res.locals.params.orderId!;
    const userId: number = res.locals.params.userId!;
    console.log("get");
    const order: Order | undefined = await getOrderById(orderId);
    if (!order) return next(ApiError.notFound({ resource: "Order" }));
    // if (order.customerId != userId)
    //   return next(ApiError.notOwned({ resource: "Order" }));
    const designsWithoutImages = await getDesignsForOrder(orderId);
    const designs: Design[] = [];
    for (const design of designs) {
      const images: ImageWithPositionAndScale[] = await getImagesByDesignId(
        design.id,
      );
      design.images = images;
      designs.push(design);
    }
    console.log(designs);
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

export const deleteDesignController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const designId: number = res.locals.params.designId!;
    const userId: number = res.locals.user.user_id;
    const designToDelete: Design | undefined = await getDesignById(designId);
    if (!designToDelete) return next(ApiError.notFound({ resource: "Design" }));
    if (designToDelete.customerId != userId)
      return next(ApiError.notOwned({ resource: "Design" }));
    await deleteDesignById(designId);
    res.status(200).send("Design deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const duplicateDesignController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const designId: number = res.locals.params.designId!;
    const userId: number = res.locals.user.user_id;
    console.log(designId);
    const designToDuplicate: Design | undefined = await getDesignById(designId);
    if (!designToDuplicate)
      return next(ApiError.notFound({ resource: "Design" }));
    if (designToDuplicate.customerId != userId)
      return next(ApiError.notOwned({ resource: "Design" }));
    await duplicateDesign({ designId });
    res.status(200).send("Design duplicated successfully");
  } catch (error) {
    next(error);
  }
};
