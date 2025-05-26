import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorMessages, User } from "abipulli-types";
import { ApiError } from "src/error/ApiError";
import { getUserById } from "src/services/users/getUser.service";

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

// const token: string | undefined = extractToken(req);

interface AuthenticateParams {
  token: string | undefined;
  setUser: (user: TokenContent) => void;
  throwError: (error: Error | ApiError | unknown) => void;
}

const authenticate = async ({
  token,
  setUser,
  throwError,
}: AuthenticateParams) => {
  try {
    if (!token) {
      return throwError(
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
      return throwError(
        new ApiError({ code: 401, info: errorMessages.faultyToken })
      );
    }
    const user: User | undefined = await getUserById(userData.user_id);
    if (user == undefined) {
      return throwError(
        new ApiError({ code: 401, info: errorMessages.tokenUserDoesNotExist })
      );
    }
    setUser({ user_id: user.id, role_power: user.role!.rolePower });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throwError(new ApiError({ code: 401, info: errorMessages.faultyToken }));
    }
    throwError(error);
  }
};

export const authenticateHttp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = extractToken(req);
  authenticate({
    token: token,
    setUser: (user: TokenContent) => {
      res.locals.user = user;
      next();
    },
    throwError: () => {},
  });
};

