import {
  foreignKey,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { chats } from "./chat.entity";
import { designs } from "./design.entity";
import { images } from "./image.entity";
import { orders } from "./order.entity";
import { messages } from "./message.entity";
import { roles } from "./role.entity";

export const users = pgTable(
  "users",
  {
    id: serial().notNull().primaryKey(),
    name: varchar().notNull(),
    email: varchar().notNull().unique(),
    password: varchar(),
    school: varchar(),
    role_id: integer().notNull().default(0),
  },
  (table) => [
    foreignKey({
      columns: [table.role_id],
      foreignColumns: [roles.id],
      name: "fk_user_role",
    }),
  ]
);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type SelectUserWithRole = typeof users.$inferSelect & {
  role: typeof roles.$inferSelect;
};

export const userRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.role_id],
    references: [roles.id],
  }),
  orders: many(orders),
  images: many(images),
  messages: many(messages),
  designs: many(designs),
  chats: many(chats),
}));
