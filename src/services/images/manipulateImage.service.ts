import { eq } from "drizzle-orm";
import { imageToDesign, SelectImageToDesign } from "src/db";
import db from "src/db/db";

export const manipulateImageOnDesign = async (
  imageId: number,
  designId: number,
  xPosition: number,
  yPosition: number,
  xScale: number,
  yScale: number
): Promise<SelectImageToDesign | undefined> => {
  const result = await db
    .update(imageToDesign)
    .set({
      x_position: xPosition,
      y_position: yPosition,
      x_scale: xScale,
      y_scale: yScale,
    })
    .where(eq(imageToDesign.image_id, imageId))
    .returning();
  return result[0];
};
