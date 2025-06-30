import { users } from "src/db";
import { getDb } from "src/db/db";
import { eq } from "drizzle-orm";

export const updateUserPassword = async (
  userId: number,
  newPassword: string
) => {
  await getDb()
    .update(users)
    .set({ password: newPassword })
    .where(eq(users.id, userId));
};
