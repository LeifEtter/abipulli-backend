import type { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { logger } from "../logging/logger";

const validateBody =
  (schema: z.ZodObject<any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json("Error during Validation.");
      }

      req.body = result.data;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        logger.error(err);
        res.status(400).json("Error during Validation.");
      } else {
        res.status(500).json("Uh Oh, Something went Wrong (╥﹏╥) ");
      }
    }
  };

export default validateBody;
