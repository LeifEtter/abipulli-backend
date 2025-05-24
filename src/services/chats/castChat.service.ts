import { Chat } from "abipulli-types";
import { SelectChat, SelectChatWithRelations } from "src/db";
import { castMessage } from "./castMessage.service";

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
