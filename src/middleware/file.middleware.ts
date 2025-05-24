import { errorMessages } from "abipulli-types";
import { ApiError } from "src/error/ApiError";
import { NextFunction, Request, Response } from "express";
import multer from "multer";

const multerClient = multer();

export const uploadSingleImage = (fieldName: string) => {
  const singleUpload = multerClient.single(fieldName);
  return (req: Request, res: Response, next: NextFunction) => {
    singleUpload(req, res, (err: any) => {
      if (err) {
        return next(
          new ApiError({ code: 400, info: errorMessages.missingImage })
        );
      }
      next();
    });
  };
};
