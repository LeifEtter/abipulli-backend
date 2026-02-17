import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { InsertOrder, InsertUser, orders, users } from "../../src/db";
import { getDb } from "src/db/db";

export const testUtils = {
  insertUser: async (user: InsertUser): Promise<number> =>
    (await getDb().insert(users).values(user).returning())[0]!.id,
  insertOrder: async (order: InsertOrder): Promise<number> =>
    (await getDb().insert(orders).values(order).returning())[0]!.id,
  deleteUser: async (id: number) =>
    await getDb().delete(users).where(eq(users.id, id)),
};

export const mockUtils = {
  user: ({ roleId }: { roleId: number }): InsertUser => ({
    first_name: faker.person.fullName(),
    last_name: faker.person.lastName(),
    gender: faker.helpers.arrayElement(["weiblich", "männlich"]),
    mobile_country_code: faker.helpers.arrayElement(["+49", "+41", "+43"]),
    mobile_number: faker.phone
      .number({ style: "international" })
      .substring(3, -1),
    birthdate: faker.date.past({ years: 20 }),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 20 }),
    role_id: roleId,
  }),
  order: ({ userId }: { userId: number }): InsertOrder => ({
    user_id: userId,
    deadline: faker.date.anytime(),
    school_city: faker.location.city(),
    school_country_code: faker.helpers.arrayElement(["DE", "CH", "AT"]),
    billing_address: faker.location.streetAddress({}),
    student_amount: faker.number.int({ min: 50, max: 150 }),
    current_grade: faker.number.int({ min: 10, max: 13 }),
    graduation_year: faker.number.int({ min: 2025, max: 2030 }),
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
  await getDb().delete(users).where(eq(users.email, email));
