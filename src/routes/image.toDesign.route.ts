import { AddImageToDesignSchema, errorMessages } from "abipulli-types";
import { placeImageOnDesign } from "controllers/design.controller";
import { ApiError } from "error/ApiError";
import { Request, Response, NextFunction, Router } from "express";
import { authenticate } from "middleware/authentication.middleware";
import { minPower } from "middleware/authorization.middleware";
import { validateBody } from "middleware/validation.middleware";
import { getDesignById } from "services/designs/getDesignById.service";
import { getImageById } from "services/images/getImageById.service";

const router = Router({ mergeParams: true });

const addImageToDesign = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = res.locals.params;
    const image = await getImageById(params.imageId!);
    if (!image) {
      return next(
        new ApiError({ code: 404, info: errorMessages.resourceNotFound })
      );
    }
    const design = await getDesignById(params.designId!);
    if (!design) {
      return next(
        new ApiError({ code: 404, info: errorMessages.resourceNotFound })
      );
    }
    const imageToDesign = await placeImageOnDesign(

    );
    res.status(200).json(imageToDesign);
  } catch (error) {
    next(error);
  }
};

router
  .route("/")
  .post(authenticate, minPower(2), validateBody(AddImageToDesignSchema));

export default router;
