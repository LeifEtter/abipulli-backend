import { images } from "src/db";
import db from "src/db/db";
import { ApiError } from "src/error/ApiError";

interface InsertImageIntoDBParams {
  userId: number;
  fileSize: number;
  fileUuid: string;
  width: number;
  height: number;
}

export const insertImageIntoDb = async ({
  userId,
  fileSize,
  fileUuid,
  width,
  height,
}: InsertImageIntoDBParams): Promise<number> => {
  const result = await db
    .insert(images)
    .values({
      user_id: userId,
      file_size: fileSize,
      file_uuid: fileUuid,
      image_width: width,
      image_height: height,
    })
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
