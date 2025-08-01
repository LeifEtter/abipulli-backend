import { InsertDesign, SelectDesign, SelectDesignWithRelations } from "src/db";
import { castPullover } from "src/services/pullovers/castPullover.service";
import { castTextElement } from "./castTextElement.service";
import { castImage } from "src/services/images/castImage.service";
import { Design } from "abipulli-types";

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
    images: design.imageToDesign.map((e) => ({
      imageToDesignId: e.id,
      ...castImage(e.image),
    })),
  };
};

export const castDesignToDb = (design: Design): InsertDesign => {
  return {
    order_id: design.orderId,
    customer_id: design.customerId,
    design_cost: design.designCost ?? 0,
    preferred_pullover_id: design.preferredPullover?.id,
  };
};
