import { Image } from "abipulli-types";
import { SelectImage } from "src/db";

export const castImage = (image: SelectImage): Image => {
  return {
    id: image.id,
    createdAt: new Date(image.created_at),
    generated: image.generated ?? false,
    prompt: image.prompt ?? "",
    userId: image.user_id ?? 0,
  };
};
