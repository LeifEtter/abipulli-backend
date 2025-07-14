import { FormData, fetch } from "undici";
import { IDEOGRAM_URL } from "src/configs/ideogram.config";
import { ApiError } from "src/error/ApiError";
import { logger } from "src/lib/logger";
import type { AspectRatio } from "abipulli-types";

export interface QueryImageFromIdeogramProps {
  prompt: string;
  aspectRatio: AspectRatio;
  referenceImage?: Buffer;
  renderingSpeed: string;
}

export const queryImageFromIdeogram = async (
  params: QueryImageFromIdeogramProps
) => {
  const formData = new FormData();

  formData.append("prompt", params.prompt);
  formData.append("aspect_ratio", params.aspectRatio);
  formData.append("rendering_speed", "TURBO");
  formData.append("magic_prompt", "AUTO");
  if (params.referenceImage) {
    const blob = new Blob([params.referenceImage], {
      type: "image/png",
    });
    formData.append("style_reference_images", blob, "reference-image.png");
  }
  const res = await fetch(IDEOGRAM_URL, {
    method: "POST",
    headers: {
      "Api-Key": process.env.IDEOGRAM_KEY!,
    },
    body: formData,
  });

  if (!res.ok) {
    logger.error(await res.text());
    throw ApiError.internal({
      errorInfo: {
        msg: "Ideogram Query failed",
        code: 500,
      },
    });
  }

  const body: any = await res.json();
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
