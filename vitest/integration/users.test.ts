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
  await insertRoles();
}, 50000);

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
      const insertedUser: InsertUser = await userFactory.insertSingleUser();
      const fetchedUser = await getUserById(insertedUser.id!);
      const matchObject: Partial<User> = {
        firstName: insertedUser.first_name,
        lastName: insertedUser.last_name,
        email: insertedUser.email,
      };
      expect(fetchedUser).toMatchObject(matchObject);
    });

    it("should return undefined", async () => {
      const fetchedUser = await getUserById(999);
      expect(fetchedUser).toBe(undefined);
    });
  });

  describe("deleteUser", async () => {
    it("should properly delete a user from the db", async () => {
      const insertedUser: InsertUser = await userFactory.insertSingleUser();
    });
  });
});
