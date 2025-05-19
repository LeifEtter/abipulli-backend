import { eq } from "drizzle-orm";
import {
  roles,
  users,
  type InsertUser,
  type SelectRole,
  type SelectUserWithRole,
} from "../db/index";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "auth/auth.constants";
import jwt from "jsonwebtoken";
import { deleteAllImagesInFolder } from "services/image.service";
import db from "db/db";

export const getUserByEmail = async (
  email: string
): Promise<SelectUserWithRole | undefined> =>
  await db.query.users.findFirst({
    where: eq(users.email, email),
    with: { role: true },
  });

export const getUserById = async (
  id: number
): Promise<SelectUserWithRole | undefined> =>
  await db.query.users.findFirst({
    where: eq(users.id, id),
    with: { role: true },
  });

export const getRole = async (
  power: number
): Promise<SelectRole | undefined> => {
  return await db.query.roles.findFirst({ where: eq(roles.role_power, power) });
};

export const createUser = async (newUser: InsertUser) =>
  await db.insert(users).values(newUser).returning();

export const encryptPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, SALT_ROUNDS);

export const passwordIsValid = async (
  pass1: string,
  pass2: string
): Promise<boolean> => await bcrypt.compare(pass1, pass2);

export const createToken = (userId: number, rolePower: number): string =>
  jwt.sign(
    {
      user_id: userId,
      role_power: rolePower,
    },
    process.env.JWT_SECRET!
  );

export const createAnonymousToken = (ipAddress: string): string =>
  jwt.sign({ ip_address: ipAddress }, process.env.JWT_SECRET!);

export const deleteAllUserData = async (id: number) => {
  await deleteAllImagesInFolder(`${process.env.NODE_ENV}/users/${id}/`);
  await db.delete(users).where(eq(users.id, id));
};
