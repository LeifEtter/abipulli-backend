import db from "db/db";
import { designs, imageToDesign, InsertDesign } from "db/index";
import { NextFunction, Request, Response } from "express";
import { logger } from "lib/logger";
import {
  AddImageToDesign,
  ApiResponse,
  DesignCreate,
  DesignResponse,
  errorMessages,
} from "abipulli-types";
import { getDesignById } from "services/designs/getDesignById.service";
import { ApiError } from "error/ApiError";
import { getImageById } from "services/images/getImageById.service";

export const createDesignController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body as DesignCreate;
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
