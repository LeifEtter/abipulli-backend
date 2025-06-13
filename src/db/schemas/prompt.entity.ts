import {
  foreignKey,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./user.entity";

export const prompts = pgTable(
  "prompts",
  {
    id: serial().notNull().primaryKey(),
    user_id: integer().notNull(),
    title: varchar().notNull(),
    description: varchar().notNull(),
    content: varchar().notNull(),
    purpose: varchar(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [users.id],
      name: "fk_prompt_user_id",
    }).onDelete("cascade"),
  ]
);

export type InsertPrompt = typeof prompts.$inferInsert;
export type SelectPrompt = typeof prompts.$inferSelect;
