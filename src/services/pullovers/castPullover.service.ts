import { Pullover } from "abipulli-types";
import {
  InsertPullover,
  SelectPullover,
  SelectPulloverWithImage,
} from "src/db";
import { castImage } from "../images/castImage.service";

export const castPullover = (pullover: SelectPulloverWithImage): Pullover => {
  return {
    id: pullover.id,
    createdAt: new Date(pullover.created_at),
    updatedAt: new Date(pullover.updated_at),
    name: pullover.name,
    description: pullover.description,
    color: pullover.color,
    basePrice: pullover.base_price,
    imageId: pullover.image_id,
    image: castImage(pullover.image),
  };
};

export const castPulloverToDb = (pullover: Pullover): InsertPullover => {
  return {
    name: pullover.name,
    description: pullover.description,
    color: pullover.color,
    base_price: pullover.basePrice,
    image_id: pullover.imageId,
  };
};
