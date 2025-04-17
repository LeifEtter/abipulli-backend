import { eq } from "drizzle-orm";
import db from "../../db/db";
import {
  roles,
  users,
  type InsertUser,
  type SelectRole,
  type SelectUser,
  type SelectUserWithRole,
} from "../../db/schema";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "auth/auth.constants";
import jwt from "jsonwebtoken";

export const deleteUser = async ({ email }: { email: string }) => {
  const userToDelete = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (userToDelete == null) {
    console.log("User doesn't exist");
  } else {
    await db.delete(users).where(eq(users.email, email));
  }
};

// export const createJwt = ({ password }: { password: string }): string => {};
export const getUserByEmail = async (
  email: string
): Promise<SelectUserWithRole | undefined> =>
  await db.query.users.findFirst({
    where: eq(users.email, email),
    with: { role: true },
  });

export const getUserById = async (id: number) =>
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
