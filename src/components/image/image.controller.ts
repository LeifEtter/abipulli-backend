import ApiError from "error/ApiError";
import { errorMessages } from "error/errorMessages";
import { NextFunction, Request, Response } from "express";
import { uploadImageToHetzner } from "./image.util";
import db from "db/db";
import { images } from "db/schema";
import { logger } from "logging/logger";
import { eq } from "drizzle-orm";

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
    const insertImageResult = await insertImageIntoDb(userId);
    if (insertImageResult.length == 0) {
      return next(
        new ApiError({ code: 500, info: errorMessages.imageUploadFailed })
      );
    }
    const uploadResult = await uploadImageToHetzner({
      file: file.buffer,
      path: `${process.env.NODE_ENV}/users/${userId}`,
      filename: `${insertImageResult[0]?.id}`,
      imageType: "image/png",
    });
    if (!uploadResult) {
      await db.delete(images).where(eq(images.id, insertImageResult[0]!.id!));
      return next(
        new ApiError({ code: 400, info: errorMessages.imageUploadFailed })
      );
    }
    res.status(200).send({
      link: `${process.env.HETZNER_STORAGE_WITH_BUCKET}/${process.env.NODE_ENV}/users/${userId}/${insertImageResult[0]?.id}`,
    });
  } catch (error) {
    next(error);
  }
};
