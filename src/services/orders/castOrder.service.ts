import {
  CountryCode,
  Order,
  OrderCreateParams,
  OrderStatus,
} from "abipulli-types";
import { InsertOrder, SelectOrder, SelectOrderWithRelations } from "src/db";
import { castChat } from "src/services/chats/castChat.service";
import { castDesign } from "src/services/designs/castDesign.service";

export const castOrder = (order: SelectOrder): Order => {
  return {
    id: order.id,
    createdAt: new Date(order.created_at!),
    updatedAt: new Date(order.updated_at),
    schoolCity: order.school_city,
    schoolCountryCode: order.school_country_code as CountryCode,
    graduationYear: order.graduation_year,
    currentGrade: order.current_grade,
    studentAmount: order.student_amount ?? 0,
    customerId: order.user_id ?? 0,
    deadline: order.deadline ?? new Date(),
    school: order.school_name ?? "",
    motto: order.motto ?? "",
    status: order.status as OrderStatus,
    deliveryAddress: order.delivery_address ?? "",
    billingAddress: order.billing_address ?? "",
  };
};

export const castOrderWithRelations = (
  order: SelectOrderWithRelations
): Order => {
  return {
    id: order.id,
    createdAt: new Date(order.created_at!),
    updatedAt: new Date(order.updated_at),
    schoolCity: order.school_city,
    schoolCountryCode: order.school_country_code as CountryCode,
    graduationYear: order.graduation_year,
    currentGrade: order.current_grade,
    studentAmount: order.student_amount ?? 0,
    customerId: order.user_id ?? 0,
    deadline: order.deadline ?? new Date(),
    school: order.school_name ?? "",
    motto: order.motto ?? "",
    status: order.status as OrderStatus,
    deliveryAddress: order.delivery_address ?? "",
    billingAddress: order.billing_address ?? "",
    designs: order.designs.map((design) => castDesign(design)),
    chats: order.chats.map((chat) => castChat(chat)),
  };
};

export const castOrderToDb = (order: Order): InsertOrder => ({
  user_id: order.customerId,
  status: order.status,
  deadline: order.deadline,
  school_name: order.school,
  motto: order.motto,
  school_city: order.schoolCity,
  school_country_code: order.schoolCountryCode,
  graduation_year: order.graduationYear,
  current_grade: order.currentGrade,
  student_amount: order.studentAmount,
  delivery_address: order.deliveryAddress,
  billing_address: order.billingAddress,
});

export const castCreateOrder = ({
  orderData,
  userId,
}: {
  orderData: OrderCreateParams;
  userId: number;
}): InsertOrder => ({
  user_id: userId,
  status: "STARTED",
  deadline: orderData.deadline,
  school_name: orderData.school,
  motto: orderData.motto,
  school_city: orderData.schoolCity,
  school_country_code: orderData.schoolCountryCode,
  graduation_year: orderData.graduationYear,
  current_grade: orderData.currentGrade,
  student_amount: orderData.studentAmount,
});
