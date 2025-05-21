import { Message } from "abipulli-types";
import { SelectMessage, SelectMessageWithRelations } from "db";
import { castDesign } from "services/designs/castDesign.service";

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
