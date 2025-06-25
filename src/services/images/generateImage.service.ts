import {
  IdeogramImage,
  IdeogramRequest,
  IdeogramResponse,
} from "abipulli-types";
import { ApiError } from "src/error/ApiError";
import { logger } from "src/lib/logger";

export const queryImageFromIdeogram = async (
  request: IdeogramRequest
): Promise<IdeogramImage[]> => {
  const res = await fetch(process.env.IDEOGRAM_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": process.env.IDEOGRAM_KEY!,
    },
    body: JSON.stringify({
      prompt: request.prompt,
      aspect_ratio: request.aspect_ratio,
      rendering_speed: request.rendering_speed,
      magic_prompt: process.env.IDEOGRAM_MAGIC_PROMPT,
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
