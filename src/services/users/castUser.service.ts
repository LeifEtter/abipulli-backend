import { InsertUser, SelectUser, SelectUserWithRelations } from "src/db";
import { castRole } from "./castRole.service";
import {
  Gender,
  MobileCountryCode,
  User,
  UserCreateParams,
} from "abipulli-types";
import { castImage } from "src/services/images/castImage.service";
import { castDesign } from "src/services/designs/castDesign.service";
import { castChat } from "src/services/chats/castChat.service";
import { castOrder } from "src/services/orders/castOrder.service";

export const castUser = (user: SelectUser): User => {
  return {
    id: user.id,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at),
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    gender: user.gender as Gender,
    mobileCountryCode: user.mobile_country_code as MobileCountryCode,
    mobileNumber: user.mobile_number,
    birthdate: new Date(user.birthdate),
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
    gender: user.gender as Gender,
    mobileCountryCode: user.mobile_country_code as MobileCountryCode,
    mobileNumber: user.mobile_number,
    birthdate: new Date(user.birthdate),
    verified: user.verified,
    images: user.images.map((image) => castImage(image)),
    designs: user.designs.map((design) => castDesign(design)),
    chats: user.chats.map((chat) => castChat(chat)),
    orders: user.orders.map((order) => castOrder(order)),
    password: user.password,
  };
};

export const castUserToDb = (user: User): InsertUser => {
  return {
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    password: user.password,
    verified: user.verified,
    gender: user.gender,
    mobile_country_code: user.mobileCountryCode,
    mobile_number: user.mobileNumber,
    birthdate: user.birthdate,
  };
};

export const castUserToRegisterToDb = (user: UserCreateParams): InsertUser => {
  return {
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    password: user.password,
    gender: user.gender,
    mobile_country_code: user.mobileCountryCode,
    mobile_number: user.mobileNumber,
    birthdate: user.birthdate,
  };
};
