import { relations } from "drizzle-orm";
import {
  chats,
  designs,
  users,
  imageToDesign,
  roles,
  designSuggestions,
  orders,
  images,
  messages,
  textElements,
} from "./schema";

export const roleRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

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

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.user_id],
    references: [users.id],
  }),
  chats: many(chats),
  images: many(images),
  designs: many(designs),
}));

export const chatRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.user_id],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [chats.order_id],
    references: [orders.id],
  }),
  messages: many(messages),
  designSuggestions: many(designSuggestions),
}));

export const messageRelations = relations(messages, ({ one, many }) => ({
  chat: one(chats, {
    fields: [messages.chat_id],
    references: [chats.id],
  }),
  sender: one(users, {
    fields: [messages.sender_id],
    references: [users.id],
  }),
  design: one(designs, {
    fields: [messages.design_id],
    references: [designs.id],
  }),
  images: many(images),
}));

export const designRelations = relations(designs, ({ one, many }) => ({
  customer: one(users, {
    fields: [designs.customer_id],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [designs.order_id],
    references: [orders.id],
  }),
  imageLinks: many(imageToDesign),
  designSuggestions: many(designSuggestions),
}));

export const imageRelations = relations(images, ({ one, many }) => ({
  user: one(users, {
    fields: [images.user_id],
    references: [users.id],
  }),
  imageLinks: many(imageToDesign),
}));

export const imageToDesignRelations = relations(imageToDesign, ({ one }) => ({
  image: one(images, {
    fields: [imageToDesign.image_id],
    references: [images.id],
  }),
  design: one(designs, {
    fields: [imageToDesign.design_id],
    references: [designs.id],
  }),
}));

export const designSuggestionRelations = relations(
  designSuggestions,
  ({ one }) => ({
    chat: one(chats, {
      fields: [designSuggestions.chat_id],
      references: [chats.id],
    }),
    design: one(designs, {
      fields: [designSuggestions.design_id],
      references: [designs.id],
    }),
  })
);

export const textElementsRelations = relations(textElements, ({ one }) => ({
  design: one(designs, {
    fields: [textElements.design_id],
    references: [designs.id],
  }),
}));
