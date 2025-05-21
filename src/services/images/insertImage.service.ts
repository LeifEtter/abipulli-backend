import { images } from "db";
import db from "db/db";
import { ApiError } from "error/ApiError";

export const insertImageIntoDb = async (userId: number): Promise<number> => {
  const result = await db
    .insert(images)
    .values({ user_id: userId })
    .returning({ id: images.id });
  if (result[0] == null) {
    throw ApiError.internal({
      errorInfo: {
        code: 500,
        msg: "Issue inserting Image into DB",
      },
    });
  }
  return result[0].id;
};
