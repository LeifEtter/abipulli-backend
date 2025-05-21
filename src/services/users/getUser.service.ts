import { SelectUser, users } from "db";
import db from "db/db";
import { eq } from "drizzle-orm";

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

// TODO: Implement Service for Calculating Storage Usage

// TODO: Implement Service for Calculating Total Cost of User Generated Content
