import { eq } from "drizzle-orm";
import db from "../../db/db";
import {
  role,
  user,
  type InsertUser,
  type SelectRole,
  type SelectUser,
  type SelectUserWithRole,
} from "../../db/schema";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../../constants/misc";

export const deleteUser = async ({ email }: { email: string }) => {
  const userToDelete = await db.query.user.findFirst({
    where: eq(user.email, email),
  });
  if (userToDelete == null) {
    console.log("User doesn't exist");
  } else {
    await db.delete(user).where(eq(user.email, email));
  }
};

// export const createJwt = ({ password }: { password: string }): string => {};
export const getUserByEmail = async (
  email: string
): Promise<SelectUserWithRole | undefined> =>
  await db.query.user.findFirst({
    where: eq(user.email, email),
    with: { role: true },
  });

export const getRole = async (
  power: number
): Promise<SelectRole | undefined> => {
  return await db.query.role.findFirst({ where: eq(role.role_power, power) });
};

export const createUser = async (newUser: InsertUser) =>
  await db.insert(user).values(newUser).returning();

export const encryptPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, SALT_ROUNDS);
