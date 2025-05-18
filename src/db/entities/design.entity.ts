import {
  boolean,
  foreignKey,
  integer,
  pgTable,
  serial,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { images } from "./image.entity";
import { relations } from "drizzle-orm";
import { orders } from "./order.entity";
import { users } from "./user.entity";
import { messages } from "./message.entity";
import { imageToDesign } from "./imageToDesign.entity";
import { designSuggestions } from "./chat.entity";

export const designs = pgTable(
  "designs",
  {
    id: serial().notNull().primaryKey(),
    order_id: integer().notNull(),
    customer_id: integer().notNull(),
    pullover_color: varchar(),
    pullover_model: varchar(),
    design_cost: integer(),
  },
  (table) => [
    foreignKey({
      columns: [table.order_id],
      foreignColumns: [orders.id],
      name: "fk_designs_orders",
    }),
    foreignKey({
      columns: [table.customer_id],
      foreignColumns: [users.id],
      name: "fk_design_customer",
    }).onDelete("cascade"),
  ]
);

export type InsertDesign = typeof designs.$inferInsert;
export type SelectDesign = typeof designs.$inferSelect;

export const designRelations = relations(designs, ({ one, many }) => ({
  customer: one(users, {
    fields: [designs.customer_id],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [designs.order_id],
    references: [orders.id],
  }),
  imageLinks: many(imageToDesign),
  designSuggestions: many(designSuggestions),
}));
