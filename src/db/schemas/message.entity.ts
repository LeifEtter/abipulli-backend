import {
  foreignKey,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { SelectUser, users } from "./user.entity";
import { chats, SelectChat } from "./chat.entity";
import { designs, SelectDesign } from "./design.entity";
import { images, SelectImage } from "./image.entity";

export const messages = pgTable(
  "messages",
  {
    id: serial().notNull().primaryKey(),
    chat_id: integer().notNull(),
    sender_id: integer().notNull(),
    content: text().notNull(),
    design_id: integer(),
    created_at: timestamp().defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.sender_id],
      foreignColumns: [users.id],
      name: "fk_message_sender_id_user_id",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.chat_id],
      foreignColumns: [chats.id],
      name: "fk_message_chat_id_chat_id",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.design_id],
      foreignColumns: [designs.id],
      name: "fk_message_design_id_design_id",
    }).onDelete("set null"),
  ]
);

export type InsertMessage = typeof messages.$inferInsert;
export type SelectMessage = typeof messages.$inferSelect;
export type SelectMessageWithRelations = SelectMessage & {
  chat: SelectChat;
  sender: SelectUser;
  design: SelectDesign;
  images: SelectImage[];
};

export const messageRelations = relations(messages, ({ one, many }) => ({
  chat: one(chats, {
    fields: [messages.chat_id],
    references: [chats.id],
  }),
  sender: one(users, {
    fields: [messages.sender_id],
    references: [users.id],
  }),
  design: one(designs, {
    fields: [messages.design_id],
    references: [designs.id],
  }),
  images: many(images),
}));
