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

export const users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({
      name: "users_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull(),
  },
  (table) => [unique("users_email_unique").on(table.email)]
);

export const imageToDesign = pgTable(
  "image_to_design",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    imageId: bigint("image_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    designId: bigint("design_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).notNull(),
    name: varchar().notNull(),
    email: varchar().notNull(),
    password: varchar().notNull(),
    school: varchar(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
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

export const chat = pgTable(
  "chat",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).notNull(),
    content: text(),
    userId: varchar("user_id"),
    lastMessageAt: timestamp("last_message_at", { mode: "string" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    createdAt: bigint("created_at", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    orderId: bigint("order_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    chatId: bigint("chat_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    senderId: bigint("sender_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    chatId: bigint("chat_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    designId: bigint("design_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    accepted: bigint({ mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).notNull(),
    creationAt: timestamp("creation_at", { mode: "string" }).notNull(),
    creationCost: smallint("creation_cost"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    origin: bigint({ mode: "number" }),
    generated: boolean(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    prompt: bigint({ mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: "number" }).notNull(),
  roleName: varchar("role_name").notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  rolePower: bigint("role_power", { mode: "number" }).notNull(),
});
