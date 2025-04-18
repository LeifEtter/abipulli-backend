import type { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { logger } from "../logging/logger";
import ApiError from "error/ApiError";
import { errorMessages } from "error/errorMessages";

export const validateBody =
  (schema: z.ZodObject<any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json("Error during Validation.");
      }

      req.body = result.data;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        logger.error(err);
        res.status(400).json("Error during Validation.");
      } else {
        res.status(500).json("Uh Oh, Something went Wrong (╥﹏╥) ");
      }
    }
  };

export const validateParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.params["id"]) {
    return next(
      new ApiError({ code: 400, info: errorMessages.paramIdMissing })
    );
  }
  const paramId: number = parseInt(req.params["id"]);
  if (!paramId) {
    return next(
      new ApiError({ code: 400, info: errorMessages.paramIdMalformed })
    );
  }
  res.locals.id = paramId;
  next();
};
