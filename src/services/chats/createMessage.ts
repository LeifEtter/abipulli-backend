import { InsertMessage, messages, SelectMessage } from "src/db";
import db from "src/db/db";
import { ApiError } from "src/error/ApiError";

export const createMessage = async (
  msg: InsertMessage
): Promise<SelectMessage> => {
  try {
    const insert = await db.insert(messages).values(msg).returning();
    if (!insert || insert.length == 0 || insert[0] == undefined) {
      throw new ApiError({
        code: 500,
        info: "Message couldn't be created",
        resource: "Message",
      });
    }
    const insertedMessage: SelectMessage = insert[0];
    return insertedMessage;
  } catch (error: any) {
    throw error;
  }
};
