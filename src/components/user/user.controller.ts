import type { NextFunction, Request, Response } from "express";
import ApiError from "../../error/ApiError";
import { getErr } from "../../constants/errorMessages";
import type {
  AnonymousLoginSchema,
  GoogleSignOnSchema,
  UserLoginSchemaType,
  UserRegistrationSchemaType,
} from "../../validation/schemas/userSchemas";
import { logger } from "../../logging/logger";
import "../../db/relation";
import {
  createAnonymousToken,
  createToken,
  createUser,
  encryptPassword,
  getRole,
  getUserByEmail,
  passwordIsValid,
} from "./user.util";

/** */
/** Sign in Anonymous User */
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

export const googleSSORegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/** Sign in SSO User */

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
          info: getErr("emailAlreadyRegistered")!,
        })
      );
    }
    const password = await encryptPassword(body.password);
    const createdUser = await createUser({
      name: body.name,
      email: body.email,
      password: password,
      role_id: (await getRole(0))?.id,
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

/** Sign in Email and Password User */
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
          info: getErr("faultyLoginCredentials")!,
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
