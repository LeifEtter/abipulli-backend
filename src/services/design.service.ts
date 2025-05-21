import { Design } from "abipulli-types";
import db from "db/db";
import { designs, SelectDesign, SelectDesignWithRelations } from "db/index";
import { eq } from "drizzle-orm";
import { castTextElement } from "./textElement.service";
import { castImage } from "./image.service";
import { castPullover } from "./pullover.service";

export const castDesign = (design: SelectDesign): Design => {
  return {
    id: design.id,
    createdAt: new Date(design.created_at),
    updatedAt: new Date(design.updated_at),
    orderId: design.order_id,
    customerId: design.customer_id,
    designCost: design.design_cost ?? 0,
  };
};

export const castDesignWithRelations = (
  design: SelectDesignWithRelations
): Design => {
  return {
    id: design.id,
    createdAt: new Date(design.created_at),
    updatedAt: new Date(design.updated_at),
    orderId: design.order_id,
    customerId: design.customer_id,
    designCost: design.design_cost ?? 0,
    preferredPullover: design.preferredPullover
      ? castPullover(design.preferredPullover)
      : undefined,
    textElements: design.texts.map((text) => castTextElement(text)),
    images: design.imageToDesign.map((e) => castImage(e.image)),
  };
};

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
