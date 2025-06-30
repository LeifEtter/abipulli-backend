import { Design } from "abipulli-types";
import { getDb } from "src/db/db";
import { designs, SelectDesignWithRelations } from "src/db/index";
import { eq } from "drizzle-orm";
import { castDesignWithRelations } from "./castDesign.service";

export const getDesignById = async (
  designId: number
): Promise<Design | undefined> => {
  const dbDesign: SelectDesignWithRelations | undefined =
    await getDb().query.designs.findFirst({
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
      },
    });
  if (!dbDesign) {
    return undefined;
  }
  return castDesignWithRelations(dbDesign);
};

export const getDesignsForOrder = async (
  orderId: number
): Promise<Design[]> => {
  const dbDesigns: SelectDesignWithRelations[] =
    await getDb().query.designs.findMany({
      where: eq(designs.order_id, orderId),
      with: {
        customer: true,
        order: true,
        preferredPullover: {
          with: {
            image: true,
          },
        },
        imageToDesign: {
          with: {
            image: true,
          },
        },
        texts: true,
      },
    });
  return dbDesigns.map((design) => castDesignWithRelations(design));
};
