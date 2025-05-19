import db from "db/db";
import { orders, SelectOrder } from "db/index";
import { eq } from "drizzle-orm";

export const getOrderById = async (
  id: number
): Promise<SelectOrder | undefined> => {
  const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  return order;
};
