import { Image } from "abipulli-types";
import { SelectImage } from "db";

export const castImage = (image: SelectImage): Image => {
  return {
    id: image.id,
    createdAt: new Date(image.created_at),
    origin: image.origin ?? "",
    generated: image.generated ?? false,
    prompt: image.prompt ?? "",
    userId: image.user_id ?? 0,
  };
};
