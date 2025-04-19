import ApiError from "error/ApiError";
import { errorMessages } from "error/errorMessages";
import { NextFunction, Request, Response } from "express";
import { uploadImageToHetzner } from "./image.util";
import db from "db/db";
import { images } from "db/schema";
import { logger } from "logging/logger";
import { eq } from "drizzle-orm";

export const saveImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file: Express.Multer.File | undefined = req.file;
  const userId: number = res.locals.user!.user_id;
  const orderId: number = res.locals.params!.id!;
  if (file == undefined) {
    return next(new ApiError({ code: 400, info: errorMessages.missingImage }));
  }
  const buffer: Buffer = file.buffer;
  const imageRecord = await db
    .insert(images)
    .values({
      user_id: userId,
      order_id: orderId,
    })
    .returning({ id: images.id });
  if (imageRecord.length == 0) {
    return next(
      new ApiError({ code: 500, info: errorMessages.imageUploadFailed })
    );
  }
  const uploadResult = await uploadImageToHetzner({
    file: buffer,
    path: `${process.env.NODE_ENV}/users/${userId}`,
    filename: `${imageRecord[0]?.id}`,
    imageType: "image/png",
  });
  if (!uploadResult) {
    await db.delete(images).where(eq(images.id, imageRecord[0]!.id!));
    return next(
      new ApiError({ code: 400, info: errorMessages.imageUploadFailed })
    );
  }
  res.status(200).send({
    link: `https://abipulli.nbg1.your-objectstorage.com/${process.env.NODE_ENV}/users/${userId}/${imageRecord[0]?.id}`,
  });
};
