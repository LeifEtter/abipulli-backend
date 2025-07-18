import { images, imageToDesign, SelectImage } from "src/db";
import { getDb } from "src/db/db";
import { eq } from "drizzle-orm";
import { Image, ImageWithPositionAndScale } from "abipulli-types";
import { castImage, castImageWithPositionAndScale } from "./castImage.service";
import { ApiError } from "src/error/ApiError";

export const getImageById = async (
  imageId: number
): Promise<Image | undefined> => {
  const dbImage: SelectImage | undefined = await getDb().query.images.findFirst(
    {
      where: eq(images.id, imageId),
    }
  );
  if (!dbImage) return undefined;
  return castImage(dbImage);
};

export const getImageWithPositionAndScale = async (
  imageToDesignId: number
): Promise<ImageWithPositionAndScale> => {
  const dbImage = await getDb().query.imageToDesign.findFirst({
    where: eq(imageToDesign.id, imageToDesignId),
    with: { image: true },
  });
  if (!dbImage) throw ApiError.notFound({ resource: "Image To Design" });
  const image: ImageWithPositionAndScale =
    castImageWithPositionAndScale(dbImage);
  return image;
};

export const getImagesByDesignId = async (
  designId: number
): Promise<ImageWithPositionAndScale[]> => {
  const dbImages = await getDb().query.imageToDesign.findMany({
    where: eq(imageToDesign.design_id, designId),
    with: { image: true },
  });
  const images: ImageWithPositionAndScale[] = dbImages.map((e) =>
    castImageWithPositionAndScale(e)
  );
  return images;
};

export const getImagesByUserId = async (userId: number): Promise<Image[]> => {
  const dbImages: SelectImage[] = await getDb()
    .select()
    .from(images)
    .where(eq(images.user_id, userId));
  return dbImages.map((image) => castImage(image));
};
