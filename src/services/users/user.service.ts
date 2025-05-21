import { eq } from "drizzle-orm";
import {
  roles,
  SelectUser,
  SelectUserWithRelations,
  users,
  type InsertUser,
  type SelectRole,
} from "../../db/index";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "auth/auth.constants";
import jwt from "jsonwebtoken";
import {
  castImage,
  deleteAllImagesInFolder,
} from "services/images/image.service";
import db from "db/db";
import { User } from "abipulli-types";
import { castRole } from "./role.service";
import { castOrder } from "../orders/order.service";
import { castDesign } from "../designs/design.service";
import { castChat } from "services/chats/chat.service";

// TODO: Implement Service for Calculating Storage Usage

// TODO: Implement Service for Calculating Total Cost of User Generated Content

export const castUser = (user: SelectUser): User => {
  return {
    id: user.id,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at),
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    school: user.school ?? "",
    verified: user.verified,
    role: castRole(user.role),
    password: user.password,
  };
};

export const castUserWithRelations = (user: SelectUserWithRelations): User => {
  return {
    id: user.id,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at),
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: castRole(user.role),
    school: user.school ?? "",
    verified: user.verified,
    images: user.images.map((image) => castImage(image)),
    designs: user.designs.map((design) => castDesign(design)),
    chats: user.chats.map((chat) => castChat(chat)),
    orders: user.orders.map((order) => castOrder(order)),
    password: user.password,
  };
};

export const getUserWithPasswordByEmail = async (
  email: string
): Promise<SelectUser | undefined> =>
  await db.query.users.findFirst({
    where: eq(users.email, email),
    with: { role: true },
  });

export const getUserById = async (
  id: number
): Promise<SelectUser | undefined> =>
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
