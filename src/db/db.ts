import "dotenv/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import * as entities from "./index";
import pg, { Pool as PL } from "pg";
const { Pool } = pg;

export const schema = {
  ...entities,
};

let dbInstance: NodePgDatabase<typeof schema> & { $client: PL };

export const initDb = (poolOrUrl: string | pg.Pool) => {
  const pool: pg.Pool =
    typeof poolOrUrl === "string"
      ? new Pool({ connectionString: poolOrUrl })
      : poolOrUrl;
  dbInstance = drizzle(pool, {
    schema: { ...entities },
  });
  return dbInstance;
};

export const getDb = (): NodePgDatabase<typeof schema> & { $client: PL } => {
  if (!dbInstance) throw new Error("Drizzle DB not initialized. Call initDb()");
  return dbInstance;
};
