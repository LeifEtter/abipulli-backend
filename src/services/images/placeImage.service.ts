import { imageToDesign } from "db";
import db from "db/db";

export const placeImageOnDesign = async (
  imageId: number,
  designId: number,
  xPosition: number,
  yPosition: number
): Promise<number | undefined> => {
  const result = await db
    .insert(imageToDesign)
    .values({
      image_id: imageId,
      design_id: designId,
      x_position: xPosition,
      y_position: yPosition,
    })
    .returning({ id: imageToDesign.id });
  return result[0]?.id;
};
