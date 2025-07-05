import { fakerDE } from "@faker-js/faker";
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
      email,
      password: encryptedPassword,
      verified: true,
      school: fakerDE.location.street() + "Gymnasium",
      role_id: 2,
    })
    .returning();
  return insertedUsers[0]!;
};

export const userFactory: UserFactory = {
  insertSingleUser,
};
