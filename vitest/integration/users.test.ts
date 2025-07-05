import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { getDb } from "src/db/db";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { users } from "src/db";
import { getUserById } from "src/services/users/getUser.service";
import { User } from "abipulli-types";
import insertRoles from "src/db/seed/insert-roles";
import { setupFakeDb, teardownFakeDb } from "vitest/helpers/fake.db";

let container: StartedPostgreSqlContainer;

beforeAll(async () => {
  container = await setupFakeDb();
});

afterAll(async () => {
  await teardownFakeDb(container);
});

let client: PoolClient;

beforeEach(async () => {
  client = await getDb().$client.connect();
  await client.query("BEGIN");
});

afterEach(async () => {
  await client.query("ROLLBACK");
  client.release();
});

describe("User Service Integration", () => {
  describe("getUser()", async () => {
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
});
