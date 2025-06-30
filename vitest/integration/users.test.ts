import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { getDb, initDb } from "src/db/db";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { users } from "src/db";
import { getUserById } from "src/services/users/getUser.service";
import { User } from "abipulli-types";
import insertRoles from "src/db/seed/insert-roles";

let container: StartedPostgreSqlContainer;

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:13.3-alpine").start();
  const db = initDb(container.getConnectionUri());
  await migrate(db, { migrationsFolder: "drizzle/" });
}, 30000);

afterAll(async () => {
  await getDb().$client.end();
  await container?.stop();
});

describe("getUser", () => {
  it("returns correct user by id", async () => {
    const db = getDb();
    await insertRoles();

    const insertedUser = await db
      .insert(users)
      .values({
        email: "gandalf@gmail.com",
        first_name: "Gandalf",
        last_name: "the Gray",
        verified: true,
        password: "somepass123",
        school: "OSG",
        role_id: 2,
      })
      .returning();

    const fetchedUser = await getUserById(insertedUser[0]!.id);
    const matchObject: Partial<User> = {
      firstName: "Gandalf",
      lastName: "the Gray",
      email: "gandalf@gmail.com",
    };
    expect(fetchedUser).toMatchObject(matchObject);
  });
});
