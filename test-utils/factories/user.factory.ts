import { fakerDE } from "@faker-js/faker";
import { users } from "src/db";
import db from "src/db/db";

export interface UserFactory {
  insertSingleUser: () => Promise<number>;
}

export const insertSingleUser = async (): Promise<number> => {
  const insertedUserId = await db
    .insert(users)
    .values({
      first_name: fakerDE.person.firstName(),
      last_name: fakerDE.person.lastName(),
      email: fakerDE.internet.email(),
      password: fakerDE.internet.password(),
      verified: true,
      school: fakerDE.location.street() + "Gymnasium",
      role_id: 1,
    })
    .returning({ id: users.id });

  return insertedUserId[0]!.id!;
};

export const userFactory: UserFactory = {
  insertSingleUser,
};
