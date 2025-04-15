import type { NextFunction, Request, Response } from "express";

import ApiError from "../../error/ApiError";
import { getErr } from "../../constants/errorMessages";
import type {
  UserLoginSchemaType,
  UserRegistrationSchemaType,
} from "../../validation/schemas/userSchemas";
import db from "../../db/db";
import {
  order,
  role,
  user,
  type SelectUser,
  type SelectUserWithRole,
} from "../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { logger } from "../../logging/logger";
import "../../db/relation";
import jwt from "jsonwebtoken";
import {
  createUser,
  encryptPassword,
  getRole,
  getUserByEmail,
} from "./user.util";

/** */
/** Sign in Anonymous User */
/** Sign in SSO User */

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body: UserRegistrationSchemaType = req.body;
  try {
    const existingUser = getUserByEmail(body.email);
    if (existingUser != null) {
      next(
        new ApiError({
          code: 400,
          message: getErr("emailAlreadyRegistered").msg,
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
  const body: UserLoginSchemaType = req.body;
  const userLoggingIn = await getUserByEmail(body.email);
  if (
    !userLoggingIn ||
    !(await bcrypt.compare(body.password, userLoggingIn.password!))
  ) {
    if (!userLoggingIn) {
      logger.error("Account Not found");
    } else {
      logger.error("Passwords don't match");
    }
    return next(
      new ApiError({ code: 400, message: getErr("faultyLoginCredentials").msg })
    );
  }
  const token = jwt.sign(
    {
      user_id: userLoggingIn.id,
      role_power: userLoggingIn.role.role_power,
    },
    process.env.JWT_SECRET!
  );
  res.status(200).send({
    token,
  });
};
