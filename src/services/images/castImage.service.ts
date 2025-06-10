import { ImageWithPositionAndScale } from "abipulli-types";
import { Image } from "abipulli-types";
import { InsertImage, SelectImage, SelectImageToDesignWithImage } from "src/db";

const buildImageUrl = (image: SelectImage): string => {
  let url: string;
  if (image.user_id != null) {
    url = `${process.env.HETZNER_STORAGE_WITH_BUCKET}/${image.file_env}/users/${image.user_id}/${image.file_uuid}`;
  } else {
    url = `${process.env.HETZNER_STORAGE_WITH_BUCKET}/${image.file_env}/general/${image.file_uuid}`;
  }
  return url;
};

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

// Build Proper URL
export const castImageWithPositionAndScale = (
  imageToDesign: SelectImageToDesignWithImage
): ImageWithPositionAndScale => {
  return {
    id: imageToDesign.image.id,
    userId: imageToDesign.image.user_id ?? undefined,
    createdAt: imageToDesign.image.created_at,
    generated: imageToDesign.image.generated ?? undefined,
    prompt: imageToDesign.image.prompt ?? undefined,
    positionX: imageToDesign.x_position,
    positionY: imageToDesign.y_position,
    scaleX: imageToDesign.x_scale,
    scaleY: imageToDesign.y_scale,
    uuid: imageToDesign.image.file_uuid,
  };
};
