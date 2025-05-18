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

export const orders = pgTable(
  "orders",
  {
    id: serial().notNull().primaryKey(),
    destination_country: varchar(),
    student_amount: integer(),
    user_id: integer().notNull(),
    created_at: timestamp().defaultNow(),
    deadline: timestamp(),
    school_name: varchar(),
    motto: varchar(),
  },
  (table) => [
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [users.id],
      name: "fk_order_user_id_user_id",
    }).onDelete("cascade"),
  ]
);

export type InsertOrder = typeof orders.$inferInsert;
export type SelectOrder = typeof orders.$inferSelect;

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.user_id],
    references: [users.id],
  }),
  chats: many(chats),
  images: many(images),
  designs: many(designs),
}));
