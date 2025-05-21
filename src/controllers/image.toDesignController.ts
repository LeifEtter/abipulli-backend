import { AddImageToDesign, errorMessages } from "abipulli-types";
import { ApiError } from "error/ApiError";
import { NextFunction, Request, Response } from "express";
import { logger } from "lib/logger";
import { getDesignById } from "services/designs/getDesignById.service";
import { getImageById } from "services/images/getImageById.service";
import { placeImageOnDesign } from "services/images/placeImage.service";

export const placeImageOnDesignController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body as AddImageToDesign;
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
    if (design.customerId != userId) {
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
    const result = await placeImageOnDesign(
      imageId,
      designId,
      req.body.xPosition,
      req.body.yPosition
    );
    logger.info(result);
    res
      .send(201)
      .send({ msg: `Placed image ${imageId} to design ${designId}` });
  } catch (error) {
    next(error);
  }
};
