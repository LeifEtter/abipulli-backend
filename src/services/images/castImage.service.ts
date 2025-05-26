import { ImageWithPositionAndScale } from "abipulli-types";
import { Image } from "abipulli-types";
import { InsertImage, SelectImage } from "src/db";

export const castImage = (image: SelectImage): Image => {
  return {
    id: image.id,
    createdAt: new Date(image.created_at),
    generated: image.generated ?? false,
    prompt: image.prompt ?? "",
    userId: image.user_id ?? 0,
    uuid: image.file_uuid,
  };
};

export const castImageToDb = (image: Image): InsertImage => {
  return {
    user_id: image.userId,
    prompt: image.prompt,
    generated: image.generated,
    file_uuid: image.uuid,
  };
};
