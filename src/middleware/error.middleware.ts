import type { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger";
import { ApiError } from "error/ApiError";
import { ApiResponse, ErrorResponse } from "abipulli-types";

// ! NOTE TO SELF: NEVER REMOVE ANY PARAMS OTHERWISE ERROR HANDLER WILL BE CALLED TOO LATE
export function apiErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err);
  console.error(err);

  if (err instanceof ApiError) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: err.code,
        info: err.info,
        resource: err.resource,
      },
    };
    res.status(err.code).json(errorResponse);
    return;
  }
  const internalErrorResponse: ErrorResponse = {
    success: false,
    error: { code: 500, info: "Uh Oh, an unknown Error occured (╥﹏╥)" },
  };
  res.status(500).json(internalErrorResponse);
}
