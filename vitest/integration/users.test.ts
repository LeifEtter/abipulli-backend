import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { getDb } from "src/db/db";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import { InsertUser, SelectUser, users } from "src/db";
import { getUserById } from "src/services/users/getUser.service";
import { User, UserSchema } from "abipulli-types";
import insertRoles from "src/db/seed/insert-roles";
import { setupFakeDb, teardownFakeDb } from "vitest/helpers/fake.db";
import { userFactory } from "vitest/test-utils/factories/user.factory";
import { castUser } from "src/services/users/castUser.service";
import { eq } from "drizzle-orm";
import { PoolClient } from "pg";

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
  describe("castUser", async () => {
    it("should return a casted user", async () => {
      const insertedUser: InsertUser = await userFactory.insertSingleUser();
      const retrievedUser: SelectUser | undefined =
        await getDb().query.users.findFirst({
          where: eq(users.id, insertedUser.id!),
          with: {
            role: true,
          },
        });
      const castedUser = castUser(retrievedUser!);
      expect(castedUser).toMatchObject({
        id: insertedUser.id,
        email: insertedUser.email,
        password: insertedUser.password,
        role: {
          id: insertedUser.role_id,
        },
      });
      expect(UserSchema.safeParse(castedUser).success).toEqual(true);
    });
  });

  describe("getUser", async () => {
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
