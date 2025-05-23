import type { NextFunction, Request, Response } from "express";
// import type {
//   AnonymousLoginSchema,
//   GoogleSignOnSchema,
//   UserLoginSchemaType,
//   UserRegistrationSchemaType,
// } from "../schemas/userSchemas";

import { OAuth2Client } from "google-auth-library";
import {
  errorMessages,
  User,
  UserCreate,
  UserLogin,
  UserResponse,
  UsersResponse,
} from "abipulli-types";
import { logger } from "lib/logger";
import { ApiError } from "error/ApiError";
import {
  getAllUsers,
  getUserById,
  getUserWithPasswordByEmail,
} from "services/users/getUser.service";
import { encryptPassword } from "lib/auth/encryptPassword";
import { createUser } from "services/users/createUser.service";
import { getRole } from "services/users/getRole.service";
import { deleteAllUserData } from "services/users/deleteUser.service";
import { createToken } from "lib/auth/createToken";
import { passwordIsValid } from "lib/auth/comparePasswords";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export const signInAnonymous = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const body: AnonymousLoginSchema = req.body;
//     const token: string = createAnonymousToken(body.ip_address);
//     res.status(200).send({ token });
//   } catch (error) {
//     next(error);
//   }
// };

/** Sign in SSO User */
// export const googleSSOLogin = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const body: GoogleSignOnSchema = req.body;
//     const token = await client.verifyIdToken({
//       idToken: body.google_id,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     const payload: TokenPayload | undefined = token.getPayload();
//     if (!payload || payload.email == undefined) {
//       return next(
//         new ApiError({
//           code: 401,
//           info: errorMessages.faultyToken,
//         })
//       );
//     }
//     const userLoggingIn = getUserByEmail(payload.email!);
//   } catch (error) {
//     next(error);
//   }
// };

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body: UserCreate = req.body;
  try {
    const existingUser = await getUserWithPasswordByEmail(body.email);
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
      first_name: body.firstName,
      last_name: body.lastName,
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
    const body: UserLogin = req.body;
    const storedUser = await getUserWithPasswordByEmail(body.email);
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
    const userToDelete: User | undefined = await getUserById(userToDeleteId);
    if (!userToDelete) {
      return next(
        new ApiError({ code: 404, info: errorMessages.resourceNotFound })
      );
    }
    if (userToDelete.role!.rolePower >= 10) {
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

export const getUserDataHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.user_id;
    const userData = await getUserById(userId);
    if (!userData) {
      return next(
        new ApiError({ code: 404, info: errorMessages.resourceNotFound })
      );
    }
    const userResponse: UserResponse = {
      success: true,
      data: userData,
    };
    res.status(200).json(userResponse);
  } catch (error) {
    next(error);
  }
};

export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAllUsers();
    const userResponse: UsersResponse = {
      success: true,
      data: {
        items: users,
        total: users.length,
        page: 1,
        pageSize: users.length,
      },
    };

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const changeUserPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.user_id;
    const { oldPassword, newPassword } = req.body;
    const user = await getUserById(userId);
    if (!user) {
      return next(
        new ApiError({ code: 404, info: errorMessages.resourceNotFound })
      );
    }
    if (!passwordIsValid(user.password, oldPassword)) {
      return next(
        new ApiError({ code: 400, info: errorMessages.faultyLoginCredentials })
      );
    }
    const newPasswordHash = await encryptPassword(newPassword);
    await updateUserPassword(userId, newPasswordHash);
    res.status(200).send({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
