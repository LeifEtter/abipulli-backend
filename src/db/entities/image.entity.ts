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

export const images = pgTable(
  "images",
  {
    id: serial().notNull().primaryKey(),
    created_at: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    creation_cost: smallint("creation_cost"),
    origin: varchar(),
    generated: boolean().default(false),
    prompt: text(),
    user_id: integer(),
    message_id: integer(),
  },
  (table) => [
    index("image_index_1").using(
      "btree",
      table.generated.asc().nullsLast().op("bool_ops")
    ),
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [users.id],
      name: "fk_image_user",
    }).onDelete("cascade"),
  ]
);

export type InsertImage = typeof images.$inferInsert;
export type SelectImage = typeof images.$inferSelect;

export const imageRelations = relations(images, ({ one, many }) => ({
  user: one(users, {
    fields: [images.user_id],
    references: [users.id],
  }),
  imageLinks: many(imageToDesign),
}));
