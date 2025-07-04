import {
  response,
  type NextFunction,
  type Request,
  type Response,
} from "express";
// import type {
//   AnonymousLoginSchema,
//   GoogleSignOnSchema,
//   UserLoginSchemaType,
//   UserRegistrationSchemaType,
// } from "../schemas/userSchemas";
import {
  MessageResponse,
  errorMessages,
  User,
  UserResponse,
  UsersResponse,
  UserCreateParams,
  UserLoginParams,
  UserLoginResult,
  UserLoginResponse,
  UserCheckAuthResponse,
} from "abipulli-types";
import { logger } from "src/lib/logger";
import { ApiError } from "src/error/ApiError";
import {
  getAllUsers,
  getUserById,
  getUserWithPasswordByEmail,
} from "src/services/users/getUser.service";
import { encryptPassword } from "src/lib/auth/encryptPassword";
import { createUser } from "src/services/users/createUser.service";
import { getRole } from "src/services/users/getRole.service";
import { deleteAllUserData } from "src/services/users/deleteUser.service";
import { createToken } from "src/lib/auth/createToken";
import { passwordIsValid } from "src/lib/auth/comparePasswords";
import { updateUserPassword } from "src/services/users/updateUser.service";
import { generateVerificationCode } from "src/lib/math/generateVerificationCode";
import { sendEmail } from "src/lib/webmail/sendEmail";
import bcrypt from "bcrypt";

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body: UserCreateParams = req.body;
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
    if (process.env.NODE_ENV === "production") {
      const verificationCode = generateVerificationCode();
      await sendEmail(
        body.email,
        "Abipulli.com Verification Code",
        `Your verification code is ${verificationCode}`
      );
    }
    const password = await encryptPassword(body.password);
    await createUser({
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      password: password,
      role_id: (await getRole(1))?.id,
      verified: process.env.NODE_ENV === "production" ? false : true,
    });
    const registerResponse: MessageResponse = {
      success: true,
      data: {
        message:
          process.env.NODE_ENV === "production"
            ? "Verification email sent"
            : "User created",
      },
    };
    res.status(201).json(registerResponse);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const loginWithEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: UserLoginParams = req.body;
    const storedUser = await getUserWithPasswordByEmail(body.email);
    if (
      storedUser == null ||
      storedUser.password == null ||
      !(await passwordIsValid({
        plainPassword: body.password,
        encryptedPassword: storedUser.password,
      }))
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
    const responseData: UserLoginResponse = {
      success: true,
      data: {
        token,
        id: storedUser.id,
      },
    };
    res.cookie("jwt_token", token);
    res.status(200).send(responseData);
  } catch (err) {
    next(err);
  }
};

export const deleteUserSelfController = async (
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

export const deleteUserController = async (
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
    if (!userToDelete) return next(ApiError.notFound({ resource: "User" }));
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

export const checkTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.user_id;
    const responseData: UserCheckAuthResponse = {
      data: { id: userId },
      success: true,
    };
    res.status(200).send(responseData);
  } catch (error) {
    logger.error(error);
    next(ApiError.internal({ errorInfo: null }));
  }
};

export const getUserDataController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.user_id;
    const userData = await getUserById(userId);
    if (!userData) return next(ApiError.notFound({ resource: "User" }));
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
    res.status(200).json(userResponse);
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
    const user: User | undefined = await getUserById(userId);
    if (!user) return next(ApiError.notFound({ resource: "User" }));
    if (
      !(await passwordIsValid({
        plainPassword: oldPassword,
        encryptedPassword: user.password,
      }))
    ) {
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
