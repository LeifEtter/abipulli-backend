import { images, imageToDesign, SelectImage } from "src/db";
import db from "src/db/db";
import { eq } from "drizzle-orm";
import { ImageWithPositionAndScale } from "abipulli-types";
import { castImage, castImageWithPositionAndScale } from "./castImage.service";

export const getImageById = async (
  imageId: number
): Promise<SelectImage | undefined> =>
  await db.query.images.findFirst({ where: eq(images.id, imageId) });

export const getImagesByDesignId = async (
  designId: number
): Promise<ImageWithPositionAndScale[]> => {
  const dbImages = await db.query.imageToDesign.findMany({
    where: eq(imageToDesign.design_id, designId),
    with: { image: true },
  });
  const images: ImageWithPositionAndScale[] = dbImages.map((e) =>
    castImageWithPositionAndScale(e)
  );
  return images;
};
