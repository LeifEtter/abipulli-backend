import { Chat, Message } from "abipulli-types";
import {
  SelectChat,
  SelectChatWithRelations,
  SelectMessage,
  SelectMessageWithRelations,
} from "db/index";
import { castDesign } from "services/designs/design.service";
export const castMessageWithRelations = (
  message: SelectMessageWithRelations
): Message => {
  return {
    id: message.id,
    createdAt: new Date(message.created_at),
    content: message.content,
    senderId: message.sender_id,
    chatId: message.chat_id,
    designId: message.design_id ?? undefined,
    design: message.design ? castDesign(message.design) : undefined,
  };
};

export const castMessage = (message: SelectMessage): Message => {
  return {
    id: message.id,
    createdAt: new Date(message.created_at),
    content: message.content,
    chatId: message.chat_id,
    senderId: message.sender_id,
    designId: message.design_id ?? undefined,
  };
};

export const castChat = (chat: SelectChat): Chat => {
  return {
    id: chat.id,
    createdAt: new Date(chat.created_at),
    updatedAt: new Date(chat.updated_at),
    userId: chat.user_id,
    orderId: chat.order_id,
    lastMessageAt: new Date(chat.last_message_at ?? new Date()),
    messages: [],
  };
};

export const castChatWithRelations = (chat: SelectChatWithRelations): Chat => {
  return {
    id: chat.id,
    createdAt: new Date(chat.created_at),
    updatedAt: new Date(chat.updated_at),
    userId: chat.user_id,
    orderId: chat.order_id,
    messages: chat.messages.map((message) => castMessage(message)),
    lastMessageAt: new Date(chat.last_message_at ?? new Date()),
  };
};
