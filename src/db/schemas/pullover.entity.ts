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
    image_id: integer().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp()
      .notNull()
      .$onUpdate(() => new Date()),
    hoodie: boolean().notNull().default(false),
  },
  (table) => [
    foreignKey({
      columns: [table.image_id],
      foreignColumns: [images.id],
      name: "fk_pullover_image",
    }).onDelete("set null"),
  ]
);

export type InsertPullover = typeof pullovers.$inferInsert;
export type SelectPullover = typeof pullovers.$inferSelect;

export type SelectPulloverWithImage = SelectPullover & {
  image: SelectImage;
};

export const pulloverRelations = relations(pullovers, ({ one }) => ({
  image: one(images, {
    fields: [pullovers.image_id],
    references: [images.id],
  }),
}));
