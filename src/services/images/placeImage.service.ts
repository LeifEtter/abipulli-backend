import { imageToDesign } from "src/db";
import { getDb } from "src/db/db";

interface PlaceImageOnDesignProps {
  imageId: number;
  designId: number;
  xPosition: number;
  yPosition: number;
  xScale: number;
  yScale: number;
}

export const placeImageOnDesign = async ({
  imageId,
  designId,
  xPosition,
  yPosition,
  xScale,
  yScale,
}: PlaceImageOnDesignProps): Promise<number | undefined> => {
  const result = await getDb()
    .insert(imageToDesign)
    .values({
      image_id: imageId,
      design_id: designId,
      x_position: xPosition,
      y_position: yPosition,
      x_scale: xScale,
      y_scale: yScale,
    })
    .returning({ id: imageToDesign.id });
  return result[0]?.id;
};
