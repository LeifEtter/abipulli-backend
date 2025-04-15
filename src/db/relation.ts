import { relations } from "drizzle-orm";
import {
  chat,
  design,
  user,
  imageToDesign,
  role,
  designSuggestion,
  order,
  image,
  message,
} from "./schema";

export const roleRelations = relations(role, ({ many }) => ({
  users: many(user),
}));

export const userRelations = relations(user, ({ one, many }) => ({
  role: one(role, {
    fields: [user.role_id],
    references: [role.id],
  }),
  orders: many(order),
  images: many(image),
  messages: many(message),
  designs: many(design),
  chats: many(chat),
}));

export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(user, {
    fields: [order.user_id],
    references: [user.id],
  }),
  chats: many(chat),
  images: many(image),
  designs: many(design),
}));

export const chatRelations = relations(chat, ({ one, many }) => ({
  user: one(user, {
    fields: [chat.user_id],
    references: [user.id],
  }),
  order: one(order, {
    fields: [chat.order_id],
    references: [order.id],
  }),
  messages: many(message),
  designSuggestions: many(designSuggestion),
}));

export const messageRelations = relations(message, ({ one }) => ({
  chat: one(chat, {
    fields: [message.chat_id],
    references: [chat.id],
  }),
  sender: one(user, {
    fields: [message.sender_id],
    references: [user.id],
  }),
}));

export const designRelations = relations(design, ({ one, many }) => ({
  customer: one(user, {
    fields: [design.customer_id],
    references: [user.id],
  }),
  order: one(order, {
    fields: [design.order_id],
    references: [order.id],
  }),
  imageLinks: many(imageToDesign),
  designSuggestions: many(designSuggestion),
}));

export const imageRelations = relations(image, ({ one, many }) => ({
  user: one(user, {
    fields: [image.user_id],
    references: [user.id],
  }),
  order: one(order, {
    fields: [image.order_id],
    references: [order.id],
  }),
  imageLinks: many(imageToDesign),
}));

export const imageToDesignRelations = relations(imageToDesign, ({ one }) => ({
  image: one(image, {
    fields: [imageToDesign.image_id],
    references: [image.id],
  }),
  design: one(design, {
    fields: [imageToDesign.design_id],
    references: [design.id],
  }),
}));

export const designSuggestionRelations = relations(
  designSuggestion,
  ({ one }) => ({
    chat: one(chat, {
      fields: [designSuggestion.chat_id],
      references: [chat.id],
    }),
    design: one(design, {
      fields: [designSuggestion.design_id],
      references: [design.id],
    }),
  })
);
