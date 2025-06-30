import { eq } from "drizzle-orm";
import { imageToDesign, SelectImageToDesign } from "src/db";
import { getDb } from "src/db/db";

export const getImageToDesign = async (
  imageToDesignId: number
): Promise<SelectImageToDesign | undefined> => {
  const dbImageToDesign = await getDb().query.imageToDesign.findFirst({
    where: eq(imageToDesign.id, imageToDesignId),
  });
  return dbImageToDesign;
};
