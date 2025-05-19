import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const prompts = pgTable("prompts", {
  id: serial().notNull().primaryKey(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  content: varchar().notNull(),
  purpose: varchar(),
});

export type InsertPrompt = typeof prompts.$inferInsert;
export type SelectPrompt = typeof prompts.$inferSelect;
