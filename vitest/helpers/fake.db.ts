import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getDb, initDb, schema } from "src/db/db";
import { Pool as PL } from "pg";

export const setupFakeDb = async (): Promise<StartedPostgreSqlContainer> => {
  const container = await new PostgreSqlContainer(
    "postgres:13.3-alpine"
  ).start();
  const db = initDb(container.getConnectionUri());
  await migrate(db, { migrationsFolder: "drizzle/" });
  return container;
};

export const teardownFakeDb = async (
  container: StartedPostgreSqlContainer
): Promise<void> => {
  await getDb().$client.end();
  await container?.stop();
};
