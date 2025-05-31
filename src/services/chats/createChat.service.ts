import { chats, InsertChat } from "src/db";
import db from "src/db/db";
import { castChat } from "./castChat.service";
import { Chat } from "abipulli-types";

export const createChat = async (chat: InsertChat): Promise<Chat> => {
  const insertedChat = (
    await db
      .insert(chats)
      .values({
        order_id: chat.order_id,
        user_id: chat.user_id,
        assigned_admin_id: chat.assigned_admin_id,
      })
      .returning()
  )[0];
  if (!insertedChat) {
    throw Error();
  }
  return castChat(insertedChat);
};
