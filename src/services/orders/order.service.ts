import { Order, OrderStatus } from "abipulli-types";
import db from "db/db";
import { orders, SelectOrder, SelectOrderWithRelations } from "db/index";
import { eq } from "drizzle-orm";
import { castDesign } from "../designs/design.service";
import { castChat } from "services/chats/chat.service";

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

export const getOrderById = async (
  id: number
): Promise<SelectOrderWithRelations | undefined> => {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      designs: true,
      chats: true,
    },
  });
  return order;
};
