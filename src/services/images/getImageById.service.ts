import { images, SelectImage } from "db";
import db from "db/db";
import { eq } from "drizzle-orm";

export const getImageById = async (
  imageId: number
): Promise<SelectImage | undefined> =>
  await db.query.images.findFirst({ where: eq(images.id, imageId) });
