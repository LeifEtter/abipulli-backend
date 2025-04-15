import { eq } from "drizzle-orm";
import db from "../../db/db";
import { user } from "../../db/schema";

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
