import { messages } from "src/db";
import db from "src/db/db";
import { logger } from "src/lib/logger";
import { castMessage, castMessageToDb } from "./castMessage.service";
import { ChatMessage, MessageCreate } from "abipulli-types";

export const createMessage = async (
  msg: MessageCreate
): Promise<ChatMessage | undefined> => {
  try {
    const dbMessage = castMessageToDb(msg);
    const messageInsert = await db
      .insert(messages)
      .values(dbMessage)
      .returning();
    if (!messageInsert || messageInsert.length == 0) {
      return undefined;
    }
    const insertedMessage: ChatMessage = castMessage(messageInsert[0]!);
    return insertedMessage;
  } catch (error: any) {
    logger.error(error);
  }
};
