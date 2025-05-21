import { users } from "db";
import db from "db/db";
import { eq } from "drizzle-orm";
import { deleteAllImagesInFolder } from "services/images/deleteImages.service";

export const deleteAllUserData = async (id: number) => {
  await deleteAllImagesInFolder(`${process.env.NODE_ENV}/users/${id}/`);
  await db.delete(users).where(eq(users.id, id));
};
