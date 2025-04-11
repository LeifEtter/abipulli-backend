import {
  serial,
  pgTable,
  integer,
  varchar,
  foreignKey,
  text,
  timestamp,
  smallint,
  index,
  boolean,
} from "drizzle-orm/pg-core";

export const imageToDesign = pgTable(
  "image_to_design",
  {
    image_id: integer().notNull(),
    design_id: integer().notNull(),
    x_position: integer(),
    y_position: integer(),
  },
  (table) => [
    foreignKey({
      columns: [table.image_id],
      foreignColumns: [image.id],
      name: "fk_image_to_design_image",
    }),
    foreignKey({
      columns: [table.design_id],
      foreignColumns: [design.id],
      name: "fk_image_to_design_design",
    }),
  ]
);

export const user = pgTable(
  "user",
  {
    id: serial().notNull().primaryKey(),
    name: varchar().notNull(),
    email: varchar().notNull(),
    password: varchar(),
    school: varchar(),
    role_id: integer().notNull().default(0),
  },
  (table) => [
    foreignKey({
      columns: [table.role_id],
      foreignColumns: [role.id],
      name: "fk_user_role",
    }),
  ]
);

export const chat = pgTable(
  "chat",
  {
    id: serial().notNull().primaryKey(),
    user_id: integer().notNull(),
    last_message_at: timestamp(),
    created_at: timestamp().defaultNow(),
    order_id: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.order_id],
      foreignColumns: [order.id],
      name: "fk_chat_order",
    }),
    foreignKey({
      columns: [table.order_id],
      foreignColumns: [order.id],
      name: "fk_chat_user",
    }),
  ]
);

export const design = pgTable(
  "design",
  {
    id: serial().notNull().primaryKey(),
    order_id: integer().notNull(),
    customer_id: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.order_id],
      foreignColumns: [order.id],
      name: "fk_design_order",
    }),
    foreignKey({
      columns: [table.customer_id],
      foreignColumns: [user.id],
      name: "fk_design_customer",
    }),
  ]
);

export const message = pgTable(
  "message",
  {
    id: serial().notNull().primaryKey(),
    chat_id: integer().notNull(),
    sender_id: integer().notNull(),
    content: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.sender_id],
      foreignColumns: [user.id],
      name: "fk_message_sender_id_user_id",
    }),
    foreignKey({
      columns: [table.chat_id],
      foreignColumns: [chat.id],
      name: "fk_message_chat_id_chat_id",
    }),
  ]
);

export const designSuggestion = pgTable(
  "design_suggestion",
  {
    id: serial().notNull().primaryKey(),
    chat_id: integer().notNull(),
    design_id: integer().notNull(),
    accepted: boolean().default(false),
    denied: boolean().default(false),
  },
  (table) => [
    foreignKey({
      columns: [table.design_id],
      foreignColumns: [design.id],
      name: "fk_design_suggestion_design",
    }),
    foreignKey({
      columns: [table.chat_id],
      foreignColumns: [chat.id],
      name: "fk_design_suggestion_chat",
    }),
  ]
);

export const order = pgTable(
  "order",
  {
    id: serial().notNull().primaryKey(),
    title: varchar(),
    content: text(),
    user_id: integer().notNull(),
    created_at: timestamp().defaultNow(),
    deadline: timestamp(),
  },
  (table) => [
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [user.id],
      name: "fk_order_user_id_user_id",
    }),
  ]
);

export const image = pgTable(
  "image",
  {
    id: serial().notNull().primaryKey(),
    created_at: timestamp("creation_at", { mode: "string" }).notNull(),
    creation_cost: smallint("creation_cost"),
    origin: varchar(),
    generated: boolean().default(false),
    prompt: text(),
    user_id: integer(),
    order_id: integer().notNull(),
  },
  (table) => [
    index("image_index_1").using(
      "btree",
      table.generated.asc().nullsLast().op("bool_ops")
    ),
    foreignKey({
      columns: [table.order_id],
      foreignColumns: [order.id],
      name: "fk_image_order",
    }),
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [user.id],
      name: "fk_image_user",
    }),
  ]
);

export const role = pgTable("role", {
  id: serial("id").primaryKey().notNull(),
  role_name: varchar().notNull(),
  role_power: smallint().notNull(),
});
