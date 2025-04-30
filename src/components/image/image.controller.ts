import ApiError from "error/ApiError";
import { errorMessages } from "error/errorMessages";
import { NextFunction, Request, Response } from "express";
import {
  getFileFromImageUrl,
  queryImageFromIdeogram,
  requestImprovedPrompt,
  uploadImageToHetzner,
} from "./image.util";
import db from "db/db";
import { images } from "db/schema";
import { eq } from "drizzle-orm";
import {
  GenerateImageSchemaType,
  ImproveImageQuerySchemaType,
} from "validation/schemas/imageSchema";

const insertImageIntoDb = async (userId: number): Promise<number> => {
  const result = await db
    .insert(images)
    .values({ user_id: userId })
    .returning({ id: images.id });
  if (result[0] == null) {
    throw ApiError.internal({
      code: 500,
      msg: "Issue inserting Image into DB",
    });
  }
  return result[0].id;
};

export const saveImage = async (
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
    const userId: number = res.locals.user!.user_id;
    const insertedImageId = await insertImageIntoDb(userId);
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
    res.status(200).send({
      link: `${process.env.HETZNER_STORAGE_WITH_BUCKET}/${process.env.NODE_ENV}/users/${userId}/${insertedImageId}`,
    });
  } catch (error) {
    next(error);
  }
};

const buildBasicPrompt = ({
  motto,
  description,
  style_tags,
}: ImproveImageQuerySchemaType): string => {
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
    Style Tags: ${style_tags.toString()}
    Output only a single paragraph of plain text describing the scene. 
    Avoid using any formatting like asterisks (**), bullet points, or newline characters. 
    Do not include labels like 'Theme' or 'Style' — just describe the visual composition naturally, as if giving a scene prompt to an image generator.`;
  return prompt;
};

export const improvePrompt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { motto, description, style_tags }: ImproveImageQuerySchemaType =
      req.body;
    const prompt = buildBasicPrompt({ motto, description, style_tags });
    const improveResult = await requestImprovedPrompt(prompt);
    res.status(200).send({
      improved_prompt: improveResult.prompt,
      cost: improveResult.cost,
    });
  } catch (error) {
    next(error);
  }
};

    });
  } catch (error) {
    next(error);
  }
};
