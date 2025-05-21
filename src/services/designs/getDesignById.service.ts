import { Design } from "abipulli-types";
import db from "db/db";
import { designs, SelectDesign, SelectDesignWithRelations } from "db/index";
import { eq } from "drizzle-orm";
import { castDesignWithRelations } from "./castDesign.service";

export const getDesignById = async (
  designId: number
): Promise<Design | undefined> => {
  const dbDesign: SelectDesignWithRelations | undefined =
    await db.query.designs.findFirst({
      where: eq(designs.id, designId),
      with: {
        imageToDesign: {
          with: {
            image: true,
          },
        },
        texts: true,
        preferredPullover: {
          with: {
            image: true,
          },
        },
        customer: true,
        order: true,
        designSuggestions: true,
      },
    });
  if (!dbDesign) {
    return undefined;
  }
  return castDesignWithRelations(dbDesign);
};
