import {
  boolean,
  foreignKey,
  index,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./user.entity";
import { imageToDesign } from "./imageToDesign.entity";

export const images = pgTable(
  "images",
  {
    id: serial().notNull().primaryKey(),
    created_at: timestamp().notNull().defaultNow(),
    creation_cost: real().default(0),
    file_size: integer().default(0).notNull(), // in kb
    generated: boolean().default(false),
    prompt: text(),
    user_id: integer(),
    message_id: integer(),
    file_uuid: uuid().notNull().defaultRandom(),
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
