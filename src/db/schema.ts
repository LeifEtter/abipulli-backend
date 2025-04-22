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
  real,
} from "drizzle-orm/pg-core";

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

export const roles = pgTable("roles", {
  id: serial("id").primaryKey().notNull(),
  role_name: varchar().notNull(),
  role_power: smallint().notNull(),
});

export type InsertRole = typeof roles.$inferInsert;
export type SelectRole = typeof roles.$inferSelect;

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

export const chats = pgTable(
  "chats",
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
      foreignColumns: [orders.id],
      name: "fk_chats_orders",
    }),
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [users.id],
      name: "fk_chats_users",
    }).onDelete("cascade"),
  ]
);

export type InsertChat = typeof chats.$inferInsert;
export type SelectChat = typeof chats.$inferSelect;

export const designs = pgTable(
  "designs",
  {
    id: serial().notNull().primaryKey(),
    order_id: integer().notNull(),
    customer_id: integer().notNull(),
    pullover_color: varchar(),
    pullover_model: varchar(),
    design_cost: integer(),
  },
  (table) => [
    foreignKey({
      columns: [table.order_id],
      foreignColumns: [orders.id],
      name: "fk_designs_orders",
    }),
    foreignKey({
      columns: [table.customer_id],
      foreignColumns: [users.id],
      name: "fk_design_customer",
    }).onDelete("cascade"),
  ]
);

export type InsertDesign = typeof designs.$inferInsert;
export type SelectDesign = typeof designs.$inferSelect;

export const textElements = pgTable(
  "text_elements",
  {
    id: serial().notNull().primaryKey(),
    design_id: integer(),
    content: varchar().notNull(),
    font: varchar(),
    position_x: real(),
    position_y: real(),
  },
  (table) => [
    foreignKey({
      columns: [table.design_id],
      foreignColumns: [designs.id],
      name: "fk_text_element_design",
    }).onDelete("cascade"),
  ]
);

export type InsertTextElement = typeof textElements.$inferInsert;
export type SelectTextElement = typeof textElements.$inferSelect;

export const messages = pgTable(
  "messages",
  {
    id: serial().notNull().primaryKey(),
    chat_id: integer().notNull(),
    sender_id: integer().notNull(),
    content: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.sender_id],
      foreignColumns: [users.id],
      name: "fk_message_sender_id_user_id",
    }),
    foreignKey({
      columns: [table.chat_id],
      foreignColumns: [chats.id],
      name: "fk_message_chat_id_chat_id",
    }).onDelete("cascade"),
  ]
);

export type InsertMessage = typeof messages.$inferInsert;
export type SelectMessage = typeof messages.$inferSelect;

export const designSuggestions = pgTable(
  "design_suggestions",
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
      foreignColumns: [designs.id],
      name: "fk_design_suggestion_design",
    }),
    foreignKey({
      columns: [table.chat_id],
      foreignColumns: [chats.id],
      name: "fk_design_suggestion_chat",
    }),
  ]
);

export type InsertDesignSuggestion = typeof designSuggestions.$inferInsert;
export type SelectDesignSuggestion = typeof designSuggestions.$inferSelect;

export const orders = pgTable(
  "orders",
  {
    id: serial().notNull().primaryKey(),
    destination_country: varchar(),
    student_amount: integer(),
    user_id: integer().notNull(),
    created_at: timestamp().defaultNow(),
    deadline: timestamp(),
    school_name: varchar(),
    motto: varchar(),
  },
  (table) => [
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [users.id],
      name: "fk_order_user_id_user_id",
    }).onDelete("cascade"),
  ]
);

export type InsertOrder = typeof orders.$inferInsert;
export type SelectOrder = typeof orders.$inferSelect;

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
