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
    backImageId: pullover.back_image_id,
    frontImageId: pullover.front_image_id,
    backImage: castImage(pullover.backImage),
    frontImage: castImage(pullover.frontImage),
  };
};

export const castPulloverToDb = (pullover: Pullover): InsertPullover => {
  return {
    name: pullover.name,
    description: pullover.description,
    color: pullover.color,
    base_price: pullover.basePrice,
    back_image_id: pullover.backImageId,
    front_image_id: pullover.frontImageId,
  };
};
