import {
  foreignKey,
  integer,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orders } from "./order.entity";
import { users } from "./user.entity";
import {
  imageToDesign,
  SelectImageToDesignWithImage,
} from "./imageToDesign.entity";
import { pullovers, SelectPulloverWithImage } from "./pullover.entity";
import { textElements } from "./textElement.entity";

export const designs = pgTable(
  "designs",
  {
    id: serial().notNull().primaryKey(),
    order_id: integer().notNull(),
    customer_id: integer().notNull(),
    design_cost: integer(),
    preferred_pullover_id: integer().notNull().default(1),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp()
      .notNull()
      .$onUpdate(() => new Date()),
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
    foreignKey({
      columns: [table.preferred_pullover_id],
      foreignColumns: [pullovers.id],
      name: "fk_design_preferred_pullover",
    }).onDelete("set null"),
  ]
);

export type InsertDesign = typeof designs.$inferInsert;
export type SelectDesign = typeof designs.$inferSelect;

export type SelectDesignWithRelations = typeof designs.$inferSelect & {
  customer: typeof users.$inferSelect;
  order: typeof orders.$inferSelect;
  preferredPullover: SelectPulloverWithImage;
  imageToDesign: SelectImageToDesignWithImage[];
  texts: (typeof textElements.$inferSelect)[];
};

export const designRelations = relations(designs, ({ one, many }) => ({
  customer: one(users, {
    fields: [designs.customer_id],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [designs.order_id],
    references: [orders.id],
  }),
  preferredPullover: one(pullovers, {
    fields: [designs.preferred_pullover_id],
    references: [pullovers.id],
  }),
  imageToDesign: many(imageToDesign),
  texts: many(textElements),
}));
