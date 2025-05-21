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
import { messages, SelectMessage } from "./message.entity";
import {
  designSuggestions,
  SelectDesignSuggestion,
} from "./designSuggestion.entity";

export const chats = pgTable(
  "chats",
  {
    id: serial().notNull().primaryKey(),
    user_id: integer().notNull(),
    assigned_admin_id: integer(),
    last_message_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
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

export type SelectChatWithRelations = SelectChat & {
  messages: SelectMessage[];
  designSuggestions: SelectDesignSuggestion[];
};

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
