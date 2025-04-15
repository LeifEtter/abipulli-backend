import type { NextFunction, Request, Response } from "express";
import logger from "../logging/logger";
import ApiError from "../error/ApiError";

export function apiErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  logger.error(err);

  if (err instanceof ApiError) {
    res.status(err.code).json(err.message);
    return;
  }
  res.status(500).json("Uh Oh, Something went Wrong (╥﹏╥) ");
}
