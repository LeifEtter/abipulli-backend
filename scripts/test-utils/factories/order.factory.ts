import { fakerDE } from "@faker-js/faker";
import { InsertOrder, orders } from "src/db";
import { getDb } from "src/db/db";

export interface OrderFactory {
  insertSingleOrder: (userId: number) => Promise<number>;
}

export const insertSingleOrder = async (userId: number): Promise<number> => {
  const orderNumber = await db
    .insert(orders)
    .values({
      user_id: userId,
      deadline: fakerDE.date.anytime(),
      destination_country: fakerDE.location.country(),
      student_amount: fakerDE.number.int({ min: 50, max: 150 }),
      motto: fakerDE.word.words(2),
      school_name: fakerDE.location.street() + "Gymnasium",
      status: "pending",
    })
    .returning({ id: orders.id });

  return orderNumber[0]!.id!;
};

export const orderFactory: OrderFactory = {
  insertSingleOrder,
};
