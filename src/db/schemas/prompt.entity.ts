import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const prompts = pgTable("prompts", {
  id: serial().notNull().primaryKey(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  content: varchar().notNull(),
  purpose: varchar(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertPrompt = typeof prompts.$inferInsert;
export type SelectPrompt = typeof prompts.$inferSelect;
