import {
  foreignKey,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./user.entity";
import { chats } from "./chat.entity";
import { designs } from "./design.entity";
import { images } from "./image.entity";
import { SelectDesign } from "./design.entity";
import { SelectChat } from "./chat.entity";

export const orders = pgTable(
  "orders",
  {
    id: serial().notNull().primaryKey(),
    destination_country: varchar(),
    student_amount: integer(),
    user_id: integer().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp()
      .notNull()
      .$onUpdate(() => new Date()),
    deadline: timestamp(),
    school_name: varchar(),
    motto: varchar(),
    status: varchar().notNull(),
    delivery_address: varchar(),
    billing_address: varchar(),
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

export type SelectOrderWithRelations = SelectOrder & {
  designs: SelectDesign[];
  chats: SelectChat[];
};

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.user_id],
    references: [users.id],
  }),
  chats: many(chats),
  images: many(images),
  designs: many(designs),
}));
