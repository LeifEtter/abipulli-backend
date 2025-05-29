import { eq } from "drizzle-orm";
import { chats, SelectChatWithRelations } from "src/db";
import db from "src/db/db";
import { castChat, castChatWithRelations } from "./castChat.service";
import { Chat } from "abipulli-types";

export const getChatFromDb = async (
  chatId: number
): Promise<Chat | undefined> => {
  const dbChat = await db.query.chats.findFirst({
    where: eq(chats.id, chatId),
  });
  if (!dbChat) {
    return undefined;
  }
  const chat: Chat = castChat(dbChat);
  return chat;
};

export const getChatWithMessagesFromDb = async (
  chatId: number
): Promise<Chat | undefined> => {
  const dbChat: SelectChatWithRelations | undefined =
    await db.query.chats.findFirst({
      where: eq(chats.id, chatId),
      with: {
        messages: true,
      },
    });
  if (!dbChat) {
    return undefined;
  }
  const chat: Chat = castChatWithRelations(dbChat);
  return chat;
};
