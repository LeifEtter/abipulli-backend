import { eq } from "drizzle-orm";
import {
  designs,
  imageToDesign,
  InsertDesign,
  InsertImage,
  InsertImageToDesign,
  SelectDesign,
} from "src/db";
import { getDb } from "src/db/db";
import { getImagesByDesignId } from "../images/getImageById.service";

interface DuplicateDesignParams {
  designId: number;
}

export const duplicateDesign = async ({
  designId,
}: DuplicateDesignParams): Promise<number> => {
  const design: SelectDesign | undefined =
    await getDb().query.designs.findFirst({
      where: eq(designs.id, designId),
    });
  if (!design) throw Error; // ! IMPLEMENT ERROR
  const designToDuplicate: InsertDesign = {
    ...design,
    created_at: undefined,
    updated_at: undefined,
    id: undefined,
  };

  const result = await getDb()
    .insert(designs)
    .values(designToDuplicate)
    .returning();
  if (result.length == 0) throw Error;
  const newDesign: SelectDesign = result[0]!;

  const images = await getDb().query.imageToDesign.findMany({
    where: eq(imageToDesign.design_id, designId),
  });
  const imagesToDuplicate: InsertImageToDesign[] = [];
  for (const image of images) {
    imagesToDuplicate.push({
      ...image,
      id: undefined,
      design_id: newDesign.id,
    });
  }
  await getDb().insert(imageToDesign).values(imagesToDuplicate);
  return newDesign.id;
};
