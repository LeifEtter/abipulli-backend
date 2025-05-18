import {
  boolean,
  foreignKey,
  index,
  integer,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./user.entity";
import { imageToDesign } from "./imageToDesign.entity";
import { chats, designSuggestions } from "./chat.entity";
import { designs } from "./design.entity";
import { images } from "./image.entity";

export const prompts = pgTable("prompts", {
  id: serial().notNull().primaryKey(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  content: varchar().notNull(),
  purpose: varchar(),
});

export type InsertPrompt = typeof prompts.$inferInsert;
export type SelectPrompt = typeof prompts.$inferSelect;
