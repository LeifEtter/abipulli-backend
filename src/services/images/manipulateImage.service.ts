import { ManipulateImageInDesignParams } from "abipulli-types";
import { and, eq } from "drizzle-orm";
import { imageToDesign, SelectImageToDesign } from "src/db";
import db from "src/db/db";

export const manipulateImageOnDesign = async ({
  imageToDesignId,
  manipulation,
}: {
  imageToDesignId: number;
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
    .where(and(eq(imageToDesign.id, imageToDesignId)))
    .returning();
  return result[0];
};
