import { relations } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  integer,
  pgTable,
  serial,
} from "drizzle-orm/pg-core";
import { designs } from "./design.entity";
import { chats } from "./chat.entity";

export const designSuggestions = pgTable(
  "design_suggestions",
  {
    id: serial().notNull().primaryKey(),
    chat_id: integer().notNull(),
    design_id: integer().notNull(),
    accepted: boolean().default(false),
    denied: boolean().default(false),
  },
  (table) => [
    foreignKey({
      columns: [table.design_id],
      foreignColumns: [designs.id],
      name: "fk_design_suggestion_design",
    }),
    foreignKey({
      columns: [table.chat_id],
      foreignColumns: [chats.id],
      name: "fk_design_suggestion_chat",
    }).onDelete("cascade"),
  ]
);

export type InsertDesignSuggestion = typeof designSuggestions.$inferInsert;
export type SelectDesignSuggestion = typeof designSuggestions.$inferSelect;

export const designSuggestionRelations = relations(
  designSuggestions,
  ({ one }) => ({
    chat: one(chats, {
      fields: [designSuggestions.chat_id],
      references: [chats.id],
    }),
    design: one(designs, {
      fields: [designSuggestions.design_id],
      references: [designs.id],
    }),
  })
);
