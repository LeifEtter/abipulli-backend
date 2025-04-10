import {
  pgTable,
  unique,
  integer,
  varchar,
  foreignKey,
  bigint,
  text,
  timestamp,
  smallint,
  index,
  boolean,
} from "drizzle-orm/pg-core";

export const imageToDesign = pgTable(
  "image_to_design",
  {
    imageId: bigint("image_id", { mode: "number" }).notNull(),
    designId: bigint("design_id", { mode: "number" }).notNull(),
    position: bigint({ mode: "number" }),
  },
  (table) => [
    foreignKey({
      columns: [table.imageId],
      foreignColumns: [image.id],
      name: "fk_image_to_design_image_id_image_id",
    }),
    foreignKey({
      columns: [table.designId],
      foreignColumns: [design.id],
      name: "fk_image_to_design_design_id_design_id",
    }),
  ]
);

export const user = pgTable(
  "user",
  {
    id: bigint({ mode: "number" }).notNull(),
    name: varchar().notNull(),
    email: varchar().notNull(),
    password: varchar().notNull(),
    school: varchar(),
    roleId: bigint("role_id", { mode: "number" }),
  },
  (table) => [
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [role.id],
      name: "fk_user_role_id_role_id",
    }),
  ]
);

export type InsertUser = typeof user.$inferInsert;

export const chat = pgTable(
  "chat",
  {
    id: bigint({ mode: "number" }).notNull(),
    content: text(),
    userId: varchar("user_id"),
    lastMessageAt: timestamp("last_message_at", { mode: "string" }),
    createdAt: bigint("created_at", { mode: "number" }),
    orderId: bigint("order_id", { mode: "number" }),
  },
  (table) => [
    foreignKey({
      columns: [table.orderId],
      foreignColumns: [order.id],
      name: "fk_chat_order_id_order_id",
    }),
  ]
);

export const design = pgTable(
  "design",
  {
    id: bigint({ mode: "number" }).notNull(),
    orderId: bigint("order_id", { mode: "number" }),
    customerId: bigint("customer_id", { mode: "number" }),
  },
  (table) => [
    foreignKey({
      columns: [table.orderId],
      foreignColumns: [order.id],
      name: "fk_design_order_id_order_id",
    }),
    foreignKey({
      columns: [table.customerId],
      foreignColumns: [user.id],
      name: "fk_design_customer_id_user_id",
    }),
  ]
);

export const message = pgTable(
  "message",
  {
    id: bigint({ mode: "number" }).notNull(),
    chatId: bigint("chat_id", { mode: "number" }),
    senderId: bigint("sender_id", { mode: "number" }),
    content: bigint({ mode: "number" }),
  },
  (table) => [
    foreignKey({
      columns: [table.senderId],
      foreignColumns: [user.id],
      name: "fk_message_sender_id_user_id",
    }),
    foreignKey({
      columns: [table.chatId],
      foreignColumns: [chat.id],
      name: "fk_message_chat_id_chat_id",
    }),
  ]
);

export const designSuggestion = pgTable(
  "design_suggestion",
  {
    id: bigint({ mode: "number" }).notNull(),
    chatId: bigint("chat_id", { mode: "number" }),
    designId: bigint("design_id", { mode: "number" }),
    accepted: bigint({ mode: "number" }),
    denied: bigint({ mode: "number" }),
  },
  (table) => [
    foreignKey({
      columns: [table.designId],
      foreignColumns: [design.id],
      name: "fk_design_suggestion_design_id_design_id",
    }),
    foreignKey({
      columns: [table.chatId],
      foreignColumns: [chat.id],
      name: "fk_design_suggestion_chat_id_chat_id",
    }),
  ]
);

export const order = pgTable(
  "order",
  {
    id: bigint({ mode: "number" }).notNull(),
    title: varchar(),
    content: text(),
    userId: smallint("user_id"),
    createdAt: timestamp("created_at", { mode: "string" }),
    deadline: timestamp({ mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "fk_order_user_id_user_id",
    }),
  ]
);

export const image = pgTable(
  "image",
  {
    id: bigint({ mode: "number" }).notNull(),
    creationAt: timestamp("creation_at", { mode: "string" }).notNull(),
    creationCost: smallint("creation_cost"),
    origin: bigint({ mode: "number" }),
    generated: boolean(),
    prompt: bigint({ mode: "number" }),
    userId: bigint("user_id", { mode: "number" }),
    orderId: bigint("order_id", { mode: "number" }),
  },
  (table) => [
    index("image_index_1").using(
      "btree",
      table.generated.asc().nullsLast().op("bool_ops")
    ),
    foreignKey({
      columns: [table.orderId],
      foreignColumns: [order.id],
      name: "fk_image_order_id_order_id",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "fk_image_user_id_user_id",
    }),
  ]
);

export const role = pgTable("role", {
  id: bigint({ mode: "number" }).notNull(),
  roleName: varchar("role_name").notNull(),
  rolePower: bigint("role_power", { mode: "number" }).notNull(),
});
