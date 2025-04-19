import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { logger } from "logging/logger";
import s3 from "storage/s3Client";

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

const getKeysOfImagesInFolder = async (path: string) => {
  const listImagesInFolderCommand = new ListObjectsV2Command({
    Bucket: "abipulli",
    Prefix: path,
  });
  return (await s3.send(listImagesInFolderCommand)).Contents?.map((obj) => ({
    Key: obj.Key,
  }));
};

export const deleteAllImagesInFolder = async (
  path: string
): Promise<boolean> => {
  const objectKeys = await getKeysOfImagesInFolder(path);
  const deleteCommand = new DeleteObjectsCommand({
    Bucket: "abipulli",
    Delete: {
      Objects: objectKeys,
    },
  });
  const deleteResult = await s3.send(deleteCommand);
  if (deleteResult.$metadata.httpStatusCode == 200) {
    return true;
  } else {
    return false;
  }
};
