import { users } from "src/db";
import db from "src/db/db";
import { eq } from "drizzle-orm";

export const updateUserPassword = async (
  userId: number,
  newPassword: string
) => {
  await db
    .update(users)
    .set({ password: newPassword })
    .where(eq(users.id, userId));
};
