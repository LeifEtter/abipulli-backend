import { ImageWithPositionAndScale } from "abipulli-types";
import { Image } from "abipulli-types";
import { HETZNER_STORAGE_WITH_BUCKET } from "src/configs/hetzner.config";
import { InsertImage, SelectImage, SelectImageToDesignWithImage } from "src/db";

const buildImageUrl = (image: SelectImage): string => {
  let url: string;
  if (image.user_id != null) {
    url = `${HETZNER_STORAGE_WITH_BUCKET}/${image.file_env}/users/${image.user_id}/${image.file_uuid}`;
  } else {
    url = `${HETZNER_STORAGE_WITH_BUCKET}/${image.file_env}/general/${image.file_uuid}`;
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
    width: image.image_width,
    height: image.image_height,
    url: buildImageUrl(image),
  };
};

export const castImageToDb = (image: Image): InsertImage => {
  return {
    user_id: image.userId,
    prompt: image.prompt,
    generated: image.generated,
    file_uuid: image.uuid,
    image_height: image.height,
    image_width: image.width,
  };
};

// Build Proper URL
export const castImageWithPositionAndScale = (
  imageToDesign: SelectImageToDesignWithImage
): ImageWithPositionAndScale => {
  return {
    id: imageToDesign.image.id,
    imageToDesignId: imageToDesign.id,
    userId: imageToDesign.image.user_id ?? undefined,
    createdAt: imageToDesign.image.created_at,
    generated: imageToDesign.image.generated ?? undefined,
    prompt: imageToDesign.image.prompt ?? undefined,
    positionX: imageToDesign.x_position,
    positionY: imageToDesign.y_position,
    scaleX: imageToDesign.x_scale,
    scaleY: imageToDesign.y_scale,
    uuid: imageToDesign.image.file_uuid,
    url: buildImageUrl(imageToDesign.image),
    width: imageToDesign.image.image_width,
    height: imageToDesign.image.image_height,
  };
};
