import { foreignKey, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { images } from "./image.entity";
import { designs } from "./design.entity";
import { relations } from "drizzle-orm";

export const imageToDesign = pgTable(
  "image_to_design",
  {
    id: serial().notNull().primaryKey(),
    image_id: integer().notNull(),
    design_id: integer().notNull(),
    x_position: integer(),
    y_position: integer(),
  },
  (table) => [
    foreignKey({
      columns: [table.image_id],
      foreignColumns: [images.id],
      name: "fk_image_to_design_image",
    }),
    foreignKey({
      columns: [table.design_id],
      foreignColumns: [designs.id],
      name: "fk_image_to_design_design",
    }),
  ]
);

export type InsertImageToDesign = typeof imageToDesign.$inferInsert;
export type SelectImageToDesign = typeof imageToDesign.$inferSelect;

export const imageToDesignRelations = relations(imageToDesign, ({ one }) => ({
  image: one(images, {
    fields: [imageToDesign.image_id],
    references: [images.id],
  }),
  design: one(designs, {
    fields: [imageToDesign.design_id],
    references: [designs.id],
  }),
}));
