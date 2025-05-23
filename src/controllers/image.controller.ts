import { NextFunction, Request, Response } from "express";
import db from "db/db";
import { images } from "db/index";
import { eq } from "drizzle-orm";

import {
  errorMessages,
  GenerateImage,
  ImageUploadResultResponse,
  ImproveImageQuery,
} from "abipulli-types";
import { ApiError } from "error/ApiError";
import { uploadImageToHetzner } from "services/images/uploadImage.service";
import { requestImprovedPrompt } from "services/images/improvePrompt.service";
import {
  getFileFromImageUrl,
  queryImageFromIdeogram,
} from "services/images/generateImage.service";
import { insertImageIntoDb } from "services/images/insertImage.service";

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
    const fileSize: number = Math.round(file.size / 1024);
    const userId: number = res.locals.user!.user_id;
    const insertedImageId = await insertImageIntoDb(userId, fileSize);
    const uploadResult = await uploadImageToHetzner({
      file: file.buffer,
      path: `${process.env.NODE_ENV}/users/${userId}`,
      filename: `${insertedImageId}`,
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
        link: `${process.env.HETZNER_STORAGE_WITH_BUCKET}/${process.env.NODE_ENV}/users/${userId}/${insertedImageId}`,
        imageId: insertedImageId,
      },
    };
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const buildBasicPrompt = ({
  motto,
  description,
  styleTags,
}: ImproveImageQuery): string => {
  const prompt = `
    You are generating a visual design prompt for Ideogram.ai. The design is for graduation pullovers (Abitur), to be printed on fabric. 
    This means: 
      - No background colors 
      - Limited color palette 
      - Bold, graphic, non-photorealistic style 
      - Focus on the theme and wordplay around “ABI” 
    Use the theme below to generate a prompt describing: 
      - Composition (foreground/background) 
      - Visual symbols or objects 
      - Characters or poses 
      - Art style (e.g. screen print, cartoon, retro) 
    Include the word ${motto} prominently in the design. 
    Theme ${description}
    Style Tags: ${styleTags.toString()}
    Output only a single paragraph of plain text describing the scene. 
    Avoid using any formatting like asterisks (**), bullet points, or newline characters. 
    Do not include labels like 'Theme' or 'Style' — just describe the visual composition naturally, as if giving a scene prompt to an image generator.`;
  return prompt;
};

export const improvePromptController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { motto, description, styleTags }: ImproveImageQuery = req.body;
    const prompt = buildBasicPrompt({
      motto,
      description,
      styleTags,
    });
    const improveResult = await requestImprovedPrompt(prompt);
    res.status(200).send({
      improved_prompt: improveResult.prompt,
      cost: improveResult.cost,
    });
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
    const { prompt, styleTags }: GenerateImage = req.body;
    const userId: number = res.locals.user.user_id;
    const imageUrl: string = await queryImageFromIdeogram(prompt);
    const imageBuffer: Buffer = await getFileFromImageUrl(imageUrl);
    const fileSize: number = Math.round(imageBuffer.length / 1024);
    const insertedImageId: number = await insertImageIntoDb(userId, fileSize);
    const uploadResult = await uploadImageToHetzner({
      file: imageBuffer,
      path: `${process.env.NODE_ENV}/users/${userId}`,
      filename: `${insertedImageId}-generated`,
      imageType: "image/png",
    });
    if (!uploadResult) {
      next(
        new ApiError({ info: errorMessages.issueUploadingImage, code: 500 })
      );
    }
    res.status(200).send({
      link: `${process.env.HETZNER_STORAGE_WITH_BUCKET}/${process.env.NODE_ENV}/users/${userId}/${insertedImageId}-generated`,
    });
  } catch (error) {
    next(error);
  }
};
