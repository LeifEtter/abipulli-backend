import { errorMessages } from "error/errorMessages";
import ApiError from "error/ApiError";
import { NextFunction, Request, Response } from "express";

export const minPower =
  (minPower: number) => (req: Request, res: Response, next: NextFunction) => {
    const rolePower: number = res.locals.user.role_power;
    if (rolePower >= minPower) {
      next();
    } else {
      next(new ApiError({ code: 401, info: errorMessages.rolePowerTooLow }));
    }
  };
