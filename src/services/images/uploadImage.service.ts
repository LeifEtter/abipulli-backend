import { PutObjectCommand } from "@aws-sdk/client-s3";
import { logger } from "src/lib/logger";
import s3 from "src/lib/storage/s3Client";

interface UploadImageParams {
  file: Buffer;
  path: string;
  filename: string;
  imageType: "image/jpeg" | "image/png" | "image/webp";
}

export const uploadImageToHetzner = async ({
  file,
  path,
  filename,
  imageType,
}: UploadImageParams): Promise<boolean> => {
  const uploadCommand = new PutObjectCommand({
    Bucket: "abipulli",
    Key: `${path}/${filename}`,
    Body: file,
    ContentType: imageType,
  });
  const uploadResult = await s3.send(uploadCommand);
  if (uploadResult.$metadata.httpStatusCode == 200) {
    return true;
  } else {
    logger.error("Upload Failure");
    logger.error(uploadResult);
    return false;
  }
};
