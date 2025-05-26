import { eq } from "drizzle-orm";
import { chats } from "src/db";
import db from "src/db/db";
import { castChat } from "./castChat.service";
import { Chat } from "abipulli-types";

export const getChatFromDb = async (
  chatId: number
): Promise<Chat | undefined> => {
  const dbChat = await db.query.chats.findFirst({
    where: eq(chats.id, chatId),
    with: {
      messages: true,
    },
  });
  if (!dbChat) {
    return undefined;
  }
  const chat: Chat = castChat(dbChat);
  return chat;
};
