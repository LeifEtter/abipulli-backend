import type { NextFunction, Request, Response } from "express";
import { z, ZodError, ZodIssue } from "zod";
import { logger } from "../lib/logger";
import { errorMessages } from "abipulli-types";
import { ApiError } from "src/error/ApiError";

export const extractIssues = (issues: ZodIssue[]): string[] =>
  issues.map((issue: ZodIssue) => {
    const path = issue.path.join(".");
    const message = issue.message;

    return `Field '${path}': ${message}`;
  });

export const validateBody =
  (schema: z.ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const issues: string[] = extractIssues(result.error.issues);
        res.status(400).json({
          err_code: 16,
          err_msg: "Validation Error",
          details: issues,
        });
      } else {
        req.body = result.data;
        next();
      }
    } catch (err) {
      if (err instanceof ZodError) {
        logger.error(err);
        res.status(400).json({
          err_code: 16,
          err_msg: "Error during Validation",
          details: extractIssues(err.issues),
        });
      } else {
        res.status(500).json({
          err_code: 500,
          err_msg: "Internal Server Error",
          details: "An unexpected error occurred during validation",
        });
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
          new ApiError({ code: 400, info: errorMessages.paramIdMissing })
        );
      }
      const paramId: number = parseInt(req.params[param]);
      if (!paramId || Number.isNaN(paramId)) {
        return next(
          new ApiError({ code: 400, info: errorMessages.paramIdMalformed })
        );
      }
      res.locals.params[param] = paramId;
    }
    next();
  };
