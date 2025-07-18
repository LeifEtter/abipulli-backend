import { fakerDE } from "@faker-js/faker";
import { orders } from "src/db";
import { getDb } from "src/db/db";

export interface OrderFactory {
  insertSingleOrder: (userId: number) => Promise<number>;
}

export const insertSingleOrder = async (userId: number): Promise<number> => {
  const orderNumber = await getDb()
    .insert(orders)
    .values({
      user_id: userId,
      deadline: fakerDE.date.anytime(),
      school_city: fakerDE.location.city(),
      school_country_code: fakerDE.helpers.arrayElement(["DE", "CH", "AT"]),
      graduation_year: fakerDE.number.int({ min: 2025, max: 2027 }),
      current_grade: fakerDE.number.int({ min: 10, max: 13 }),
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
