import db from "db/db";
import { designs, imageToDesign, InsertDesign } from "db/index";
import { NextFunction, Request, Response } from "express";
import { logger } from "lib/logger";
import {
  CreateDesignSchemaType,
  PlaceImageOnDesignSchemaType,
} from "schemas/designSchema";
import { getImageById } from "services/image.service";
import { getDesignById } from "services/design.service";
import { ApiError } from "error/ApiError";

export const createDesign = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body as CreateDesignSchemaType;
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

export const placeImageOnDesign = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body as PlaceImageOnDesignSchemaType;
    const designId: number = res.locals.params.designId!;
    const imageId: number = res.locals.params.imageId!;
    const userId: number = res.locals.user.user_id;
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
    if (design.customer_id != userId) {
      return next(
        new ApiError({
          code: 401,
          info: errorMessages.resourceNotOwned,
          resource: "Design",
        })
      );
    }
    const image = await getImageById(imageId);
    if (!image) {
      return next(
        new ApiError({
          code: 404,
          info: errorMessages.resourceNotFound,
          resource: "Image",
        })
      );
    }
    const result = await db
      .insert(imageToDesign)
      .values({ ...req.body, design_id: designId, image_id: imageId });
    logger.info(result);
    res
      .send(201)
      .send({ msg: `Connected image ${imageId} to design ${designId}` });
  } catch (error) {
    next(error);
  }
};
