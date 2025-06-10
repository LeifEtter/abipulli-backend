import db from "src/db/db";
import { orders, SelectOrder, SelectOrderWithRelations } from "src/db/index";
import { eq } from "drizzle-orm";
import { castOrder } from "./castOrder.service";
import { Order } from "abipulli-types";

export const getOrderById = async (id: number): Promise<Order | undefined> => {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      designs: true,
      chats: true,
    },
  });
  return order ? castOrder(order) : undefined;
};

export const getOrdersByUserID = async (
  userId: number
): Promise<Order[] | null> => {
  const dbOrders: SelectOrder[] = await db.query.orders.findMany({
    where: eq(orders.user_id, userId),
  });
  const castedOrders: Order[] = dbOrders.map((order) => castOrder(order));
  return castedOrders;
};
