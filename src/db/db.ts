import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as entities from "./index";
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema: { ...entities } });

export default db;
