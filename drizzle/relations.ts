import { relations } from "drizzle-orm/relations";
import { image, imageToDesign, design, role, user, order, chat, message, designSuggestion } from "./schema";

export const imageToDesignRelations = relations(imageToDesign, ({one}) => ({
	image: one(image, {
		fields: [imageToDesign.imageId],
		references: [image.id]
	}),
	design: one(design, {
		fields: [imageToDesign.designId],
		references: [design.id]
	}),
}));

export const imageRelations = relations(image, ({one, many}) => ({
	imageToDesigns: many(imageToDesign),
	order: one(order, {
		fields: [image.orderId],
		references: [order.id]
	}),
	user: one(user, {
		fields: [image.userId],
		references: [user.id]
	}),
}));

export const designRelations = relations(design, ({one, many}) => ({
	imageToDesigns: many(imageToDesign),
	order: one(order, {
		fields: [design.orderId],
		references: [order.id]
	}),
	user: one(user, {
		fields: [design.customerId],
		references: [user.id]
	}),
	designSuggestions: many(designSuggestion),
}));

export const userRelations = relations(user, ({one, many}) => ({
	role: one(role, {
		fields: [user.roleId],
		references: [role.id]
	}),
	designs: many(design),
	messages: many(message),
	orders: many(order),
	images: many(image),
}));

export const roleRelations = relations(role, ({many}) => ({
	users: many(user),
}));

export const chatRelations = relations(chat, ({one, many}) => ({
	order: one(order, {
		fields: [chat.orderId],
		references: [order.id]
	}),
	messages: many(message),
	designSuggestions: many(designSuggestion),
}));

export const orderRelations = relations(order, ({one, many}) => ({
	chats: many(chat),
	designs: many(design),
	user: one(user, {
		fields: [order.userId],
		references: [user.id]
	}),
	images: many(image),
}));

export const messageRelations = relations(message, ({one}) => ({
	user: one(user, {
		fields: [message.senderId],
		references: [user.id]
	}),
	chat: one(chat, {
		fields: [message.chatId],
		references: [chat.id]
	}),
}));

export const designSuggestionRelations = relations(designSuggestion, ({one}) => ({
	design: one(design, {
		fields: [designSuggestion.designId],
		references: [design.id]
	}),
	chat: one(chat, {
		fields: [designSuggestion.chatId],
		references: [chat.id]
	}),
}));