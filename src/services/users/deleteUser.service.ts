import { users } from "src/db";
import { getDb } from "src/db/db";
import { eq } from "drizzle-orm";
import { deleteAllImagesInFolder } from "src/services/images/deleteImages.service";

export const deleteAllUserData = async (id: number) => {
  await deleteAllImagesInFolder(`${process.env.NODE_ENV}/users/${id}/`);
  await getDb().delete(users).where(eq(users.id, id));
};
