import { SelectUser, SelectUserWithRelations } from "db";
import { castRole } from "./castRole.service";
import { User } from "abipulli-types";
import { castImage } from "services/images/castImage.service";
import { castDesign } from "services/designs/castDesign.service";
import { castChat } from "services/chats/castChat.service";
import { castOrder } from "services/orders/castOrder.service";

export const castUser = (user: SelectUser): User => {
  return {
    id: user.id,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at),
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    school: user.school ?? "",
    verified: user.verified,
    role: castRole(user.role),
    password: user.password,
  };
};

export const castUserWithRelations = (user: SelectUserWithRelations): User => {
  return {
    id: user.id,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at),
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: castRole(user.role),
    school: user.school ?? "",
    verified: user.verified,
    images: user.images.map((image) => castImage(image)),
    designs: user.designs.map((design) => castDesign(design)),
    chats: user.chats.map((chat) => castChat(chat)),
    orders: user.orders.map((order) => castOrder(order)),
    password: user.password,
  };
};
