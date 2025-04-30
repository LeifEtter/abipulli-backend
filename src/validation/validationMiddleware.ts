import type { NextFunction, Request, Response } from "express";
import { z, ZodError, ZodIssue } from "zod";
import { logger } from "../logging/logger";
import ApiError from "error/ApiError";
import { errorMessages } from "error/errorMessages";

export const extractIssues = (issues: ZodIssue[]): string[] =>
  issues.map(
    (issue: ZodIssue) => " " + (issue.path[0] ?? "unknown").toString()
  );

//TODO: Implement Correct Error Message on Faulty Value for a specific key, e.g. string instead of array of strings
export const validateBody =
  (schema: z.ZodObject<any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const issues: string[] = extractIssues(result.error.issues);
        res.status(400).send({
          err_code: 16,
          err_msg: `Deinem Request Body fehlen folgende/r Key:${issues}`,
        });
      } else {
        req.body = result.data;
        next();
      }
    } catch (err) {
      if (err instanceof ZodError) {
        logger.error(err);
        res.status(400).json("Error during Validation.");
      } else {
        res.status(500).json("Uh Oh, Something went Wrong (╥﹏╥) ");
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
