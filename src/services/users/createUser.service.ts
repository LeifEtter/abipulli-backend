import { InsertUser, users } from "src/db";
import db from "src/db/db";

export const createUser = async (newUser: InsertUser) =>
  await db.insert(users).values(newUser).returning();
