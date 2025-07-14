import { NextFunction, Request, Response } from "express";
import { getDb } from "src/db/db";
import { images } from "src/db/index";
import { eq } from "drizzle-orm";
import {
  ApiResponse,
  CommentOnQueryParams,
  errorMessages,
  GenerateImageParams,
  IdeogramImage,
  IdeogramRequest,
  Image,
  ImageResponse,
  ImagesResponse,
  ImageUploadResultResponse,
  ImageWithPositionAndScale,
  ImproveImageQueryParams,
  ImproveImageQueryResponse,
  PaginatedResponse,
} from "abipulli-types";
import { ApiError } from "src/error/ApiError";
import { uploadImageToHetzner } from "src/services/images/uploadImage.service";
import { requestImprovedPrompt } from "src/services/images/improvePrompt.service";
import {
  getFileFromImageUrl,
  queryImageFromIdeogram,
  QueryImageFromIdeogramProps,
} from "src/services/images/generateImage.service";
import { insertImageIntoDb } from "src/services/images/insertImage.service";
import { randomUUID } from "crypto";
import imageSize from "image-size";
import { ISizeCalculationResult } from "image-size/dist/types/interface";
import { buildBasicPrompt } from "src/services/prompts/buildPrompt.service";
import {
  getImageById,
  getImagesByUserId,
} from "src/services/images/getImageById.service";
import { HETZNER_STORAGE_WITH_BUCKET } from "src/configs/hetzner.config";

export const saveImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file: Express.Multer.File | undefined = req.file;
    if (file == undefined)
      return next(
        new ApiError({ code: 400, info: errorMessages.missingImage })
      );
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
    try {
      const uploadResult = await uploadImageToHetzner({
        file: file.buffer,
        path: `${process.env.NODE_ENV}/users/${userId}`,
        filename: `${fileUuid}`,
        imageType: "image/png",
      });
    } catch (error) {
      await getDb().delete(images).where(eq(images.id, insertedImageId));
      throw error;
    }

    const response: ImageUploadResultResponse = {
      success: true,
      data: {
        link: `${HETZNER_STORAGE_WITH_BUCKET}/${process.env.NODE_ENV}/users/${userId}/${fileUuid}`,
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
    const prompt = buildBasicPrompt(req.body as ImproveImageQueryParams);
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

export const commentOnPrompt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: CommentOnQueryParams = req.body;
    const prompt: string = body.description;
    const comment: string = body.comment;
    const oldPrompt = `You are improving a visual design prompt for Ideogram.ai. The design is for graduation pullovers (Abitur), to be printed on fabric. 
      Design constraints:
      - No background colors
      - Limited color palette
      - Bold, graphic, non-photorealistic style
      - Focus on the theme and wordplay around “ABI”
      - Suitable for printing on textiles

      You will receive:
      1. The original image prompt describing a scene.
      2. A user comment suggesting changes or improvements.

      Your task is to rewrite and improve the prompt to reflect the user's comment. Keep it visually descriptive and concise. You may change composition, characters, objects, or style to better fit the intent. 

      Do not include any formatting (no bullet points, asterisks, or newlines).
      Do not label any sections like "Original Prompt" or "Comment".
      Only return the revised prompt as a single paragraph of plain text, suitable to be used directly in an image generator.

      Original prompt:
      ${prompt}

      User comment:
      ${comment}`;
    const improvedPrompt = await requestImprovedPrompt(oldPrompt);
    const response: ApiResponse<string> = {
      success: true,
      data: improvedPrompt.prompt,
    };
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const MAX_IMAGE_GEN: number = 1;

export const generateImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      prompt,
      styleTags,
      referenceImageId,
      aspectRatio,
    }: GenerateImageParams = req.body;
    const userId: number = res.locals.user.user_id;
    // const existingImage: Express.Multer.File | undefined = req.file;
    let buffer: Buffer | undefined;
    if (referenceImageId) {
      const image = await getImageById(referenceImageId);
      if (image) {
        buffer = await getFileFromImageUrl(image.url);
      }
    }
    const queryImageProps: QueryImageFromIdeogramProps = {
      prompt,
      aspectRatio,
      renderingSpeed: "TURBO",
      referenceImage: buffer,
    };

    const ideogramImages: IdeogramImage[] = await queryImageFromIdeogram(
      queryImageProps
    );
    const storedImages: Image[] = [];
    for (const ideogramImage of ideogramImages) {
      const imageBuffer: Buffer = await getFileFromImageUrl(ideogramImage.url);
      const fileSize: number = Math.round(imageBuffer.length / 1024);
      const dimensions: ISizeCalculationResult = imageSize(imageBuffer);
      const fileUuid = randomUUID();
      const imageId: number = await insertImageIntoDb({
        userId,
        width: dimensions.width,
        height: dimensions.height,
        fileSize,
        fileUuid,
      });
      const storedImage: Image | undefined = await getImageById(imageId);
      if (!storedImage)
        return next(
          new ApiError({
            code: 500,
            info: "Something went wrong during image storing",
          })
        );
      try {
        await uploadImageToHetzner({
          file: imageBuffer,
          path: `${process.env.NODE_ENV}/users/${userId}`,
          filename: `${fileUuid}`,
          imageType: "image/png",
        });
      } catch (error) {
        await getDb().delete(images).where(eq(images.id, imageId));
        throw error;
      }
      storedImages.push(storedImage);
    }
    const imagesResponse: ImagesResponse = {
      success: true,
      data: {
        items: storedImages,
        total: storedImages.length,
        page: 1,
        pageSize: storedImages.length,
      },
    };
    res.status(200).send(imagesResponse);
  } catch (error) {
    next(error);
  }
};

const singlePage = (
  length: number
): { pageSize: number; total: number; page: number } => ({
  page: 1,
  pageSize: length,
  total: length,
});

export const getMyImagesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Dummy Retrieve images from db
    const images: Image[] = await getImagesByUserId(res.locals.user.user_id);

    const response: ImagesResponse = {
      success: true,
      data: {
        items: images,
        ...singlePage(images.length),
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
