import { ManipulateImageInDesignParams } from "abipulli-types";
import { and, eq } from "drizzle-orm";
import { imageToDesign, SelectImageToDesign } from "src/db";
import db from "src/db/db";

export const manipulateImageOnDesign = async ({
  imageId,
  designId,
  manipulation,
}: {
  imageId: number;
  designId: number;
  manipulation: ManipulateImageInDesignParams;
}): Promise<SelectImageToDesign | undefined> => {
  const result = await db
    .update(imageToDesign)
    .set({
      x_position: manipulation.positionX,
      y_position: manipulation.positionY,
      x_scale: manipulation.scaleX,
      y_scale: manipulation.scaleY,
    })
    .where(
      and(
        eq(imageToDesign.image_id, imageId),
        eq(imageToDesign.design_id, designId)
      )
    )
    .returning();
  return result[0];
};
