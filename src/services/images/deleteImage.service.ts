import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { images } from "src/db";
import { getDb } from "src/db/db";
import { ApiError } from "src/error/ApiError";
import { logger } from "src/lib/logger";
import s3 from "src/lib/storage/s3Client";

interface ImageDeleteParams {
  path: string;
  filename: string;
}

export const deleteImageFromHetzner = async ({
  path,
  filename,
}: ImageDeleteParams) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: "abipulli",
    Key: `${path}/${filename}`,
  });
  const deleteResult = await s3.send(deleteCommand);
  const statusCode = deleteResult.$metadata.httpStatusCode!;
  if (!statusCode || statusCode < 200 || statusCode > 299) {
    logger.error(deleteResult);
    throw new ApiError({ code: 500, info: "Issue deleting image" });
  }
};

export const deleteImageById = async (imageId: number) => {
  await getDb().delete(images).where(eq(images.id, imageId));
};
