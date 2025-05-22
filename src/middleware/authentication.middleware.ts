import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorMessages, User } from "abipulli-types";
import { ApiError } from "error/ApiError";
import { SelectUser } from "db";
import { getUserById } from "services/users/getUser.service";

const extractToken = (req: Request): string | undefined =>
  req.cookies["jwt_token"] ?? req.headers.authorization?.split(" ")[1];

const extractUserDataFromToken = (
  payload: string | jwt.JwtPayload
): TokenContent | undefined =>
  typeof payload == "string" ||
  parseInt(payload["user_id"]) == undefined ||
  parseInt(payload["role_power"]) == undefined
    ? undefined
    : {
        user_id: parseInt(payload["user_id"]),
        role_power: parseInt(payload["role_power"]),
      };

export const authenticate = async (
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
    const user: User | undefined = await getUserById(userData.user_id);
    if (user == undefined) {
      return next(
        new ApiError({ code: 401, info: errorMessages.tokenUserDoesNotExist })
      );
    }
    res.locals.user = { user_id: user.id, role_power: user.role!.rolePower };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError({ code: 401, info: errorMessages.faultyToken }));
    }
    return next(error);
  }
};
