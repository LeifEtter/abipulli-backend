import type { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger";
import { ApiError } from "src/error/ApiError";
import { ErrorResponse } from "abipulli-types";
import { Socket } from "socket.io";

// ! NOTE TO SELF: NEVER REMOVE ANY PARAMS OTHERWISE ERROR HANDLER WILL BE CALLED TOO LATE

const errorHandler = (err: Error | ApiError | any): ErrorResponse => {
  logger.error(err);
  if (err instanceof ApiError) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: err.code,
        info: err.info,
        resource: err.resource,
      },
    };
    return errorResponse;
  } else {
    const internalErrorResponse: ErrorResponse = {
      success: false,
      error: { code: 500, info: "Uh Oh, an unknown Error occured (╥﹏╥)" },
    };
    return internalErrorResponse;
  }
};

export const apiErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorResponse: ErrorResponse = errorHandler(err);
  res.status(errorResponse.error!.code).send(errorResponse);
};

export const socketErrorHandler = async (socket: Socket, err: any) => {
  const errorResponse: ErrorResponse = errorHandler(err);
  socket.send("error", errorResponse);
};
