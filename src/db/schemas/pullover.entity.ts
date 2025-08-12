import {
  boolean,
  foreignKey,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { images, SelectImage } from "./image.entity";
import { relations } from "drizzle-orm";

export const pullovers = pgTable(
  "pullovers",
  {
    id: serial().notNull().primaryKey(),
    name: varchar().notNull(),
    description: varchar().notNull(),
    base_price: integer().notNull(),
    color: varchar().notNull(),
    front_image_id: integer().notNull(),
    back_image_id: integer().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp()
      .notNull()
      .$onUpdate(() => new Date()),
    hoodie: boolean().notNull().default(false),
  },
  (table) => [
    foreignKey({
      columns: [table.front_image_id],
      foreignColumns: [images.id],
      name: "fk_pullover_front_image",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.back_image_id],
      foreignColumns: [images.id],
      name: "fk_pullover_back_image",
    }).onDelete("cascade"),
  ]
);

export type InsertPullover = typeof pullovers.$inferInsert;
export type SelectPullover = typeof pullovers.$inferSelect;

export type SelectPulloverWithImage = SelectPullover & {
  backImage: SelectImage;
  frontImage: SelectImage;
};

export const pulloverRelations = relations(pullovers, ({ one }) => ({
  frontImage: one(images, {
    fields: [pullovers.front_image_id],
    references: [images.id],
  }),
  backImage: one(images, {
    fields: [pullovers.back_image_id],
    references: [images.id],
  }),
}));
