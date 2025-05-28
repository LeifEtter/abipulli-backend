import { chats } from "src/db";
import db from "src/db/db";
import { castChat, castChatToDb } from "./castChat.service";
import { Chat, ChatCreate } from "abipulli-types";

export const createChat = async ({
  orderId,
  userId,
  assignedAdminId,
}: ChatCreate): Promise<Chat> => {
  const insertedChat = (
    await db
      .insert(chats)
      .values({
        order_id: orderId,
        user_id: userId,
        assigned_admin_id: assignedAdminId,
      })
      .returning()
  )[0];
  if (!insertedChat) {
    throw Error();
  }
  return castChat(insertedChat);
};
