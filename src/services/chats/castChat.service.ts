import { Chat } from "abipulli-types";
import { InsertChat, SelectChat, SelectChatWithRelations } from "src/db";
import { castMessage } from "./castMessage.service";

export const castChat = (chat: SelectChat): Chat => {
  return {
    id: chat.id,
    createdAt: new Date(chat.created_at),
    updatedAt: new Date(chat.updated_at),
    userId: chat.user_id,
    orderId: chat.order_id ?? undefined,
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
    orderId: chat.order_id ?? undefined,
    messages: chat.messages.map((message) => castMessage(message)),
    lastMessageAt: new Date(chat.last_message_at ?? new Date()),
  };
};

export const castChatToDb = (chat: Chat): InsertChat => ({
  user_id: chat.userId,
  order_id: chat.orderId,
});
