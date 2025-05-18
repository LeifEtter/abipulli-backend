import {
  boolean,
  foreignKey,
  integer,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { designs } from "./design.entity";
import { relations } from "drizzle-orm";
import { orders } from "./order.entity";
import { users } from "./user.entity";
import { messages } from "./message.entity";

export const chats = pgTable(
  "chats",
  {
    id: serial().notNull().primaryKey(),
    user_id: integer().notNull(),
    assigned_admin_id: integer(),
    last_message_at: timestamp(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date()),
    order_id: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.order_id],
      foreignColumns: [orders.id],
      name: "fk_chats_orders",
    }),
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [users.id],
      name: "fk_chats_users",
    }).onDelete("cascade"),
  ]
);

export type InsertChat = typeof chats.$inferInsert;
export type SelectChat = typeof chats.$inferSelect;

export const chatRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.user_id],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [chats.order_id],
    references: [orders.id],
  }),
  messages: many(messages),
  designSuggestions: many(designSuggestions),
}));

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
    }),
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
