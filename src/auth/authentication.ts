import { NextFunction, Request, Response } from "express";
import ApiError from "error/ApiError";
import { errorMessages } from "constants/errorMessages";
import jwt from "jsonwebtoken";
const extractToken = (req: Request): string | undefined =>
  req.cookies["jwt_token"] ?? req.headers.authorization?.split(" ")[1];

const extractUserDataFromToken = (
  payload: string | jwt.JwtPayload
): TokenContent | undefined =>
  typeof payload == "string" ||
  payload["user_id"] == undefined ||
  payload["role_power"] == undefined
    ? undefined
    : { user_id: payload["user_id"], role_power: payload["role_power"] };

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string | undefined = extractToken(req);
    if (!token) {
      return next(
        new ApiError({ code: 401, info: errorMessages.missingToken })
      );
    }
    const payload: jwt.JwtPayload | string = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );
    const userData: TokenContent | undefined =
      extractUserDataFromToken(payload);
    if (!userData) {
      return next(new ApiError({ code: 401, info: errorMessages.faultyToken }));
    }
    res.locals.user = userData;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError({ code: 401, info: errorMessages.faultyToken }));
    }
    return next(error);
  }
};
