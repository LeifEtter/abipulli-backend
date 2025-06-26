import {
  IdeogramImage,
  IdeogramRequest,
  IdeogramResponse,
} from "abipulli-types";
import { IDEOGRAM_URL } from "src/configs/ideogram.config";
import { ApiError } from "src/error/ApiError";
import { logger } from "src/lib/logger";

export const queryImageFromIdeogram = async (
  request: IdeogramRequest
): Promise<IdeogramImage[]> => {
  const res = await fetch(IDEOGRAM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": process.env.IDEOGRAM_KEY!,
    },
    body: JSON.stringify({
      prompt: request.prompt,
      aspect_ratio: request.aspect_ratio,
      rendering_speed: request.rendering_speed,
      magic_prompt: request.magic_prompt,
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
  const body: IdeogramResponse = await res.json();
  return body.data;
};

export const getFileFromImageUrl = async (
  imageUrl: string
): Promise<Buffer> => {
  const res = await fetch(imageUrl);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
};
