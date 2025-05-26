import { images } from "src/db";
import db from "src/db/db";
import { ApiError } from "src/error/ApiError";

export const insertImageIntoDb = async (
  userId: number,
  fileSize: number,
  fileUuid: string
): Promise<number> => {
  const result = await db
    .insert(images)
    .values({ user_id: userId, file_size: fileSize, file_uuid: fileUuid })
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
