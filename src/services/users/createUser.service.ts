import { InsertUser, users } from "src/db";
import { getDb } from "src/db/db";

export const createUser = async (newUser: InsertUser) =>
  await getDb().insert(users).values(newUser).returning();
