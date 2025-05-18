import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import db from "db/db";
import { images, SelectImage } from "db/index";
import { eq } from "drizzle-orm";
import ApiError from "error/ApiError";
import { logger } from "logging/logger";
import s3 from "storage/s3Client";
interface UploadImageParams {
  file: Buffer;
  path: string;
  filename: string;
  imageType: "image/jpeg" | "image/png" | "image/webp";
}

const GPT_4o_COST = 5 / 1000000;

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

export const getImageById = async (
  imageId: number
): Promise<SelectImage | undefined> =>
  await db.query.images.findFirst({ where: eq(images.id, imageId) });

export const requestImprovedPrompt = async (
  oldPrompt: string
): Promise<{ prompt: string; cost: number }> => {
  const res = await fetch(process.env.OPENAI_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAPI_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAPI_MODEL,
      input: oldPrompt,
    }),
  });
  if (!res.ok) {
    logger.error(await res.text());
    throw ApiError.internal({
      errorInfo: {
        msg: "Issue getting prompt from GPT API",
        code: 51,
      },
    });
  }
  const body = await res.json();
  const improvedPrompt: string | undefined =
    body["output"][0]["content"][0]["text"];

  if (improvedPrompt == undefined || improvedPrompt == "") {
    logger.error(body);
    throw ApiError.internal({
      errorInfo: {
        msg: "Issue getting prompt from GPT API",
        code: 51,
      },
    });
  }
  const cost: number = body["usage"]["total_tokens"] * GPT_4o_COST;
  return { prompt: improvedPrompt, cost };
};

export const queryImageFromIdeogram = async (
  prompt: string
): Promise<string> => {
  const res = await fetch(process.env.IDEOGRAM_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": process.env.IDEOGRAM_KEY!,
    },
    body: JSON.stringify({
      image_request: {
        prompt: prompt,
        aspect_ratio: "ASPECT_1_1",
        model: process.env.IDEOGRAM_MODEL,
        magic_prompt_option: "AUTO",
      },
    }),
  });
  if (!res.ok) {
    logger.error(await res.text());
    throw ApiError.internal({
      errorInfo: {
        msg: "Ideogram Query failed",
        code: 50,
      },
    });
  }
  const body = await res.json();
  const imageUrl: string | undefined = body.data[0].url;
  if (imageUrl == undefined) {
    throw ApiError.internal({
      errorInfo: {
        msg: "Couldn't find Image Url in Ideogram Response",
        code: 50,
      },
    });
  }
  return imageUrl;
};

export const getFileFromImageUrl = async (
  imageUrl: string
): Promise<Buffer> => {
  const res = await fetch(imageUrl);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
};
