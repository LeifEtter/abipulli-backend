import db from "src/db/db";
import { orders, SelectOrderWithRelations } from "src/db/index";
import { eq } from "drizzle-orm";

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
