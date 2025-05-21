import { InsertUser, users } from "db";
import db from "db/db";

export const createUser = async (newUser: InsertUser) =>
  await db.insert(users).values(newUser).returning();
