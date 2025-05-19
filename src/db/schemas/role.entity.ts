import { relations } from "drizzle-orm";
import { pgTable, serial, smallint, varchar } from "drizzle-orm/pg-core";
import { users } from "./user.entity";

export const roles = pgTable("roles", {
  id: serial("id").primaryKey().notNull(),
  role_name: varchar().notNull(),
  role_power: smallint().notNull(),
});

export const roleRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export type InsertRole = typeof roles.$inferInsert;
export type SelectRole = typeof roles.$inferSelect;
