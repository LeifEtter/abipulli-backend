import { NextFunction, Request, Response } from "express";
import db from "src/db/db";
import { images, SelectImage } from "src/db/index";
import { eq } from "drizzle-orm";

import {
  errorMessages,
  GenerateImageParams,
  Image,
  ImagesResponse,
  ImageUploadResultResponse,
  ImproveImageQueryParams,
} from "abipulli-types";
import { ApiError } from "src/error/ApiError";
import { uploadImageToHetzner } from "src/services/images/uploadImage.service";
import { requestImprovedPrompt } from "src/services/images/improvePrompt.service";
import {
  getFileFromImageUrl,
  queryImageFromIdeogram,
} from "src/services/images/generateImage.service";
import { insertImageIntoDb } from "src/services/images/insertImage.service";
import { castImage } from "src/services/images/castImage.service";
import { randomUUID } from "crypto";
import imageSize from "image-size";
import { ISize, ISizeCalculationResult } from "image-size/dist/types/interface";

export const saveImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file: Express.Multer.File | undefined = req.file;

    if (file == undefined) {
      return next(
        new ApiError({ code: 400, info: errorMessages.missingImage })
      );
    }

    //TODO:
    const fileStorageSize: number = Math.round(file.size / 1024);
    const imageDimensions: ISizeCalculationResult = imageSize(file.buffer);
    const userId: number = res.locals.user!.user_id;
    const fileUuid = randomUUID();
    const insertedImageId = await insertImageIntoDb({
      userId,
      fileSize: fileStorageSize,
      fileUuid: fileUuid,
      width: imageDimensions.width,
      height: imageDimensions.height,
    });
    const uploadResult = await uploadImageToHetzner({
      file: file.buffer,
      path: `${process.env.NODE_ENV}/users/${userId}`,
      filename: `${fileUuid}`,
      imageType: "image/png",
    });
    if (!uploadResult) {
      await db.delete(images).where(eq(images.id, insertedImageId));
      return next(
        new ApiError({ code: 400, info: errorMessages.imageUploadFailed })
      );
    }
    const response: ImageUploadResultResponse = {
      success: true,
      data: {
        link: `${process.env.HETZNER_STORAGE_WITH_BUCKET}/${process.env.NODE_ENV}/users/${userId}/${fileUuid}`,
        imageId: insertedImageId,
      },
    };
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

export const improvePromptController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { motto, description, styleTags }: ImproveImageQueryParams = req.body;
    const prompt = buildBasicPrompt({
      motto,
      description,
      styleTags,
    });
    const improveResult = await requestImprovedPrompt(prompt);
    const improveResponse: ImproveImageQueryResponse = {
      success: true,
      data: { description: improveResult.prompt },
    };
    res.status(200).send(improveResponse);
  } catch (error) {
    next(error);
  }
};

export const generateImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { prompt, styleTags }: GenerateImageParams = req.body;
    const userId: number = res.locals.user.user_id;
    const imageUrl: string = await queryImageFromIdeogram(prompt);
    const imageBuffer: Buffer = await getFileFromImageUrl(imageUrl);
    const fileSize: number = Math.round(imageBuffer.length / 1024);
    const dimensions: ISizeCalculationResult = imageSize(imageBuffer);
    const fileUuid = randomUUID();
    const insertedImageId: number = await insertImageIntoDb({
      userId,
      width: dimensions.width,
      height: dimensions.height,
      fileSize,
      fileUuid,
    });
    const uploadResult = await uploadImageToHetzner({
      file: imageBuffer,
      path: `${process.env.NODE_ENV}/users/${userId}`,
      filename: `${fileUuid}-generated`,
      imageType: "image/png",
    });
    if (!uploadResult) {
      return next(
        new ApiError({ info: errorMessages.issueUploadingImage, code: 500 })
      );
    }
    res.status(200).send({
      link: `${process.env.HETZNER_STORAGE_WITH_BUCKET}/${process.env.NODE_ENV}/users/${userId}/${fileUuid}-generated`,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyImagesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Dummy Retrieve images from db
    const images: Image[] = await retrieveImagesFromDbByUserId(
      res.locals.user.user_id
    );

    const response: ImagesResponse = {
      success: true,
      data: {
        page: 1,
        pageSize: images.length,
        total: images.length,
        items: images,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getFreeMotivesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};
