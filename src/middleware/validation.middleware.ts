import type { NextFunction, Request, Response } from "express";
import { z, ZodError, ZodIssue } from "zod";
import { logger } from "../lib/logger";
import { errorMessages } from "abipulli-types";
import { ApiError } from "src/error/ApiError";
import { sanitizeElement } from "src/lib/security/sanitizeObject";

export const extractIssues = (issues: ZodIssue[]): string[] =>
  issues.map((issue: ZodIssue) => {
    const path = issue.path.join(".");
    const message = issue.message;

    return `Field '${path}': ${message}`;
  });

//TODO: Correct error responses to comply with ErrorResponse Type
//! SEE ABOVE!!!
export const validateBody =
  (schema: z.ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const issues: string[] = extractIssues(result.error.issues);
        return next(new ApiError({ code: 400, info: "Something went wrong" }));
        // res.status(400).json({
        //   err_code: 16,
        //   err_msg: "Validation Error",
        //   details: issues,
        // });
      } else {
        const sanitizedData = sanitizeElement(result.data);
        req.body = sanitizedData;
        next();
      }
    } catch (err) {
      if (err instanceof ZodError) {
        logger.error(err);
        return next(new ApiError({ code: 400, info: "Something went wrong" }));
        // res.status(400).json({
        //   err_code: 16,
        //   err_msg: "Error during Validation",
        //   details: extractIssues(err.issues),
        // });
      } else {
        return next(new ApiError({ code: 500, info: "Something went wrong" }));
        // res.status(500).json({
        //   err_code: 500,
        //   err_msg: "Internal Server Error",
        //   details: "An unexpected error occurred during validation",
        // });
      }
    }
  };

export const validateParams =
  ({ requiredParams }: { requiredParams: ParamKey[] }) =>
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.params = {};
    for (let param of requiredParams) {
      if (!req.params[param]) {
        return next(
          new ApiError({
            code: 400,
            info: errorMessages.paramIdMissing,
            resource: param,
          })
        );
      }
      const paramId: number = parseInt(req.params[param]);
      if (!paramId || Number.isNaN(paramId)) {
        return next(
          new ApiError({
            code: 400,
            info: errorMessages.paramIdMalformed,
            resource: param,
          })
        );
      }
      res.locals.params[param] = paramId;
    }
    next();
  };
