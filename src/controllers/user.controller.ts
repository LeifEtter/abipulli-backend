import type { NextFunction, Request, Response } from "express";
import type {
  AnonymousLoginSchema,
  GoogleSignOnSchema,
  UserLoginSchemaType,
  UserRegistrationSchemaType,
} from "../schemas/userSchemas";

import {
  createAnonymousToken,
  createToken,
  createUser,
  deleteAllUserData,
  encryptPassword,
  getRole,
  getUserByEmail,
  getUserById,
  passwordIsValid,
} from "../services/user.service";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { logger } from "lib/logger";
import { ApiError } from "error/ApiError";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signInAnonymous = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: AnonymousLoginSchema = req.body;
    const token: string = createAnonymousToken(body.ip_address);
    res.status(200).send({ token });
  } catch (error) {
    next(error);
  }
};

/** Sign in SSO User */
export const googleSSOLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: GoogleSignOnSchema = req.body;
    const token = await client.verifyIdToken({
      idToken: body.google_id,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload: TokenPayload | undefined = token.getPayload();
    if (!payload || payload.email == undefined) {
      return next(
        new ApiError({
          code: 401,
          info: errorMessages.faultyToken,
        })
      );
    }
    const userLoggingIn = getUserByEmail(payload.email!);
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body: UserRegistrationSchemaType = req.body;
  try {
    const existingUser = await getUserByEmail(body.email);
    if (existingUser != null) {
      return next(
        new ApiError({
          code: 400,
          info: errorMessages.emailAlreadyRegistered,
        })
      );
    }
    const password = await encryptPassword(body.password);
    const createdUser = await createUser({
      name: body.name,
      email: body.email,
      password: password,
      role_id: (await getRole(1))?.id,
    });
    res.status(201).json({
      msg: "Account created successfully",
      user_id: createdUser[0]!.id,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const loginWithEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: UserLoginSchemaType = req.body;
    const storedUser = await getUserByEmail(body.email);
    if (
      storedUser == null ||
      storedUser.password == null ||
      !passwordIsValid(storedUser.password, body.password)
    ) {
      logger.error("User supplied invalid credentials");
      return next(
        new ApiError({
          code: 400,
          info: errorMessages.faultyLoginCredentials,
        })
      );
    }
    const token = createToken(storedUser.id, storedUser.role.role_power);
    res.status(200).send({
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUserSelf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: number = res.locals.user!.user_id!;
    await deleteAllUserData(userId);
    res.status(200).send("You're account was deleted.");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userToDeleteId = res.locals.params!.userId!;
    if (userToDeleteId == res.locals.user!.user_id!) {
      return next(
        new ApiError({ code: 400, info: errorMessages.cantDeleteSelf })
      );
    }
    const userToDelete = await getUserById(userToDeleteId);
    if (!userToDelete) {
      return next(
        new ApiError({ code: 404, info: errorMessages.resourceNotFound })
      );
    }
    if (userToDelete.role.role_power >= 10) {
      return next(
        new ApiError({ code: 401, info: errorMessages.rolePowerTooLow })
      );
    }
    await deleteAllUserData(userToDeleteId);
    res.status(200).send(`User with id ${userToDeleteId} deleted`);
  } catch (error) {
    next(error);
  }
};

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.user_id;
    res.status(200).send({ userId });
  } catch (error) {
    logger.error(error);
    next(ApiError.internal({ errorInfo: null }));
  }
};
