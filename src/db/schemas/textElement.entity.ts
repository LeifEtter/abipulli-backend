import {
  foreignKey,
  integer,
  pgTable,
  real,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { designs } from "./design.entity";

export const textElements = pgTable(
  "text_elements",
  {
    id: serial().notNull().primaryKey(),
    design_id: integer(),
    content: varchar().notNull(),
    font: varchar(),
    position_x: real(),
    position_y: real(),
  },
  (table) => [
    foreignKey({
      columns: [table.design_id],
      foreignColumns: [designs.id],
      name: "fk_text_element_design",
    }).onDelete("cascade"),
  ]
);

export type InsertTextElement = typeof textElements.$inferInsert;
export type SelectTextElement = typeof textElements.$inferSelect;

export const textElementsRelations = relations(textElements, ({ one }) => ({
  design: one(designs, {
    fields: [textElements.design_id],
    references: [designs.id],
  }),
}));
