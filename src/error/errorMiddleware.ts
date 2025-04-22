import type { NextFunction, Request, Response } from "express";
import { logger } from "../logging/logger";
import ApiError from "./ApiError";

export function apiErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err);
  console.error(err);
  if (err instanceof ApiError) {
    res
      .status(err.code)
      .json({
        err_code: err.info.code,
        err_msg: err.info.msg,
        err_resource: err.resource,
      });
    return;
  }
  res.status(500).json("Uh Oh, Something went Wrong (╥﹏╥) ");
}
