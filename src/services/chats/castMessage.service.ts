import { ChatMessage } from "abipulli-types";
import {
  InsertMessage,
  SelectMessage,
  SelectMessageWithRelations,
} from "src/db";
import { castDesign } from "src/services/designs/castDesign.service";

export const castMessageWithRelations = (
  message: SelectMessageWithRelations
): ChatMessage => {
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

export const castMessage = (message: SelectMessage): ChatMessage => {
  return {
    id: message.id,
    createdAt: new Date(message.created_at),
    content: message.content,
    chatId: message.chat_id,
    senderId: message.sender_id,
    designId: message.design_id ?? undefined,
  };
};

export const castMessageToDb = (message: ChatMessage): InsertMessage => ({
  chat_id: message.chatId,
  sender_id: message.senderId,
  content: message.content,
  design_id: message.designId,
});
