import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import db from "../../src/db/db";
import { InsertOrder, InsertUser, orders, users } from "../../src/db";

export const testUtils = {
  insertUser: async (user: InsertUser): Promise<number> =>
    (await db.insert(users).values(user).returning())[0]!.id,
  insertOrder: async (order: InsertOrder): Promise<number> =>
    (await db.insert(orders).values(order).returning())[0]!.id,
  deleteUser: async (id: number) =>
    await db.delete(users).where(eq(users.id, id)),
};

export const mockUtils = {
  user: ({ roleId }: { roleId: number }): InsertUser => ({
    first_name: faker.person.fullName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 20 }),
    role_id: roleId,
  }),
  order: ({ userId }: { userId: number }): InsertOrder => ({
    user_id: userId,
    deadline: faker.date.anytime(),
    destination_country: faker.location.country(),
    student_amount: faker.number.int({ min: 50, max: 150 }),
    motto: faker.word.words(2),
    school_name: faker.location.street() + "Gymnasium",
    status: "pending",
  }),
};

const exampleOrder = {
  user_id: 5,
  deadline: "20/04/2024",
  destination_country: "Deutschland",
  student_amount: 83,
  school_name: "Otto-Schott-Gymnasium",
  motto: "AbIns Bett",
};

export const tDeleteUser = async (email: string) =>
  await db.delete(users).where(eq(users.email, email));
