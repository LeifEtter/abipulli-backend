import { Order, OrderStatus } from "abipulli-types";
import { InsertOrder, SelectOrder, SelectOrderWithRelations } from "src/db";
import { castChat } from "src/services/chats/castChat.service";
import { castDesign } from "src/services/designs/castDesign.service";

export const castOrder = (order: SelectOrder): Order => {
  return {
    id: order.id,
    createdAt: new Date(order.created_at!),
    updatedAt: new Date(order.updated_at),
    schoolCountry: order.destination_country ?? "",
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
    schoolCountry: order.destination_country ?? "",
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
  destination_country: order.schoolCountry,
  student_amount: order.studentAmount,
  delivery_address: order.deliveryAddress,
  billing_address: order.billingAddress,
});
