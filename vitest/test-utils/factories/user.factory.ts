import { fakerDE } from "@faker-js/faker";
import { Gender } from "abipulli-types";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "src/constants";
import { InsertUser, users } from "src/db";
import { getDb } from "src/db/db";
export interface UserFactory {
  insertSingleUser: () => Promise<InsertUser>;
}

export const insertSingleUser = async () => {
  const email: string = fakerDE.internet.email();
  const password: string = fakerDE.internet.password() + "@123";
  const encryptedPassword: string = await bcrypt.hash(password, SALT_ROUNDS);
  const insertedUsers: InsertUser[] = await getDb()
    .insert(users)
    .values({
      first_name: fakerDE.person.firstName(),
      last_name: fakerDE.person.lastName(),
      birthdate: fakerDE.date.birthdate(),
      gender: fakerDE.helpers.arrayElement([
        "divers",
        "männlich",
        "weiblich",
      ]) as Gender,
      email: fakerDE.internet.email(),
      mobile_number: fakerDE.phone.number({ style: "international" }),
      mobile_country_code: fakerDE.helpers.arrayElement(["+49", "+41", "+43"]),
      password: encryptedPassword,
      verified: true,
      role_id: 2,
    })
    .returning();
  return { ...insertedUsers[0]!, password };
};

export const userFactory: UserFactory = {
  insertSingleUser,
};
