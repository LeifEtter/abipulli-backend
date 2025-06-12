import { DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { images, imageToDesign } from "src/db";
import db from "src/db/db";
import s3 from "src/lib/storage/s3Client";

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

export const removeImageFromDesign = async (imageToDesignId: number) => {
  await db.delete(imageToDesign).where(eq(imageToDesign.id, imageToDesignId));
};
