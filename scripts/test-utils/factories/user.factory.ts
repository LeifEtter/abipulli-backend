import { fakerDE } from "@faker-js/faker";
import { users } from "src/db";
import db from "src/db/db";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "src/constants";

export interface UserFactory {
  insertSingleUser: () => Promise<{
    email: string;
    password: string;
    userId: number;
  }>;
}

export const insertSingleUser = async () => {
  const email: string = fakerDE.internet.email();
  const password: string = fakerDE.internet.password() + "@123";
  const encryptedPassword: string = await bcrypt.hash(password, SALT_ROUNDS);
  const insertedUserId = await db
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
    .returning({ id: users.id });
  return { userId: insertedUserId[0]!.id!, email, password };
};

export const userFactory: UserFactory = {
  insertSingleUser,
};
