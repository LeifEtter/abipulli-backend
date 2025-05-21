import { Pullover } from "abipulli-types";
import { SelectPullover } from "db";

export const castPullover = (pullover: SelectPullover): Pullover => {
  return {
    id: pullover.id,
    createdAt: new Date(pullover.created_at),
    updatedAt: new Date(pullover.updated_at),
    name: pullover.name,
    description: pullover.description,
    color: pullover.color,
    basePrice: pullover.base_price,
  };
};
