import {
  AddImageToDesignParams,
  AddImageToDesignResponse,
  ApiResponse,
  Design,
  ImagesForDesignResponse,
  ImageWithPositionAndScale,
  ManipulateImageInDesignParams,
} from "abipulli-types";
import { ApiError } from "src/error/ApiError";
import { NextFunction, Request, Response } from "express";
import { logger } from "src/lib/logger";
import {
  getImageById,
  getImagesByDesignId,
  getImageWithPositionAndScale,
} from "src/services/images/getImageById.service";
import { placeImageOnDesign } from "src/services/images/placeImage.service";
import { getDesignById } from "src/services/designs/getDesigns.service";
import { manipulateImageOnDesign } from "src/services/images/manipulateImage.service";
import { removeImageFromDesign } from "src/services/images/deleteImages.service";
import { getImageToDesign } from "src/services/images/getImageToDesign";
import { SelectImageToDesign, SelectImageToDesignWithImage } from "src/db";

export const placeImageOnDesignController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as AddImageToDesignParams;
    const designId: number = res.locals.params.designId!;
    const imageId: number = res.locals.params.imageId!;
    const userId: number = res.locals.user.user_id;
    const design = await getDesignById(designId);
    if (!design) return next(ApiError.notFound({ resource: "Design" }));
    if (design.customerId != userId)
      return next(ApiError.notFound({ resource: "Design" }));
    const image = await getImageById(imageId);
    if (!image) return next(ApiError.notFound({ resource: "Image" }));
    const result: number | undefined = await placeImageOnDesign({
      imageId,
      designId,
      xPosition: body.positionX,
      yPosition: body.positionY,
      xScale: body.scaleX,
      yScale: body.scaleY,
    });
    if (!result)
      throw next(
        new ApiError({
          code: 500,
          info: "Something went wrong adding image to design",
          resource: "Image To Design",
        })
      );
    const addedImage: ImageWithPositionAndScale =
      await getImageWithPositionAndScale(result);
    logger.info(result);
    const addImageToDesignResponse: AddImageToDesignResponse = {
      success: true,
      data: addedImage,
    };
    res.status(201).send(addImageToDesignResponse);
  } catch (error) {
    next(error);
  }
};

export const manipulateImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: number = res.locals.user.user_id;
    const imageId: number = res.locals.params.imageId!;
    const designId: number = res.locals.params.designId!;
    const design: Design | undefined = await getDesignById(designId);
    if (!design) return next(ApiError.notFound({ resource: "Design" }));
    // if (design.customerId != userId)
    //   return next(ApiError.notOwned({ resource: "Design" }));
    const manipulation = req.body as ManipulateImageInDesignParams;
    const newImage = await manipulateImageOnDesign({
      imageId,
      designId,
      manipulation,
    });
    const response: ApiResponse<any> = {
      success: true,
      data: newImage,
    };
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

export const getAllImagesForDesignController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: number = res.locals.user.user_id;
    const designId: number = res.locals.params.designId!;
    const design = await getDesignById(designId);
    if (!design) return next(ApiError.notFound({ resource: "Design" }));
    // if (design?.customerId != userId)
    //   return next(ApiError.notOwned({ resource: "Design" }));
    const images: ImageWithPositionAndScale[] = await getImagesByDesignId(
      designId
    );
    const imageResponse: ImagesForDesignResponse = {
      success: true,
      data: {
        items: images,
        total: images.length,
        page: 1,
        pageSize: images.length,
      },
    };
    res.status(200).send(imageResponse);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
