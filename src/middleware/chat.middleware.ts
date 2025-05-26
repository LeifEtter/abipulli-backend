import { Chat, errorMessages } from "abipulli-types";
import { ExtendedError, Socket } from "socket.io";
import { ApiError } from "src/error/ApiError";
import { getChatFromDb } from "src/services/chats/getChat.service";

export const getChatInfo = async (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  try {
    const chatIdParam: string | string[] | undefined =
      socket.handshake.query["chat_id"] ?? socket.handshake.query["chat"];
    if (!chatIdParam || Array.isArray(chatIdParam)) {
      return next(
        new ApiError({
          code: 400,
          info: errorMessages.paramIdMissing,
          resource: "chatId",
        })
      );
    }
    const chatId = parseInt(chatIdParam);
    if (!chatId) {
      return next(
        new ApiError({
          code: 400,
          info: errorMessages.paramIdMissing,
          resource: "chatId",
        })
      );
    }
    const chat: Chat | undefined = await getChatFromDb(chatId);
    if (!chat) {
      return next(
        new ApiError({
          code: 404,
          info: errorMessages.resourceNotFound,
          resource: "Chat",
        })
      );
    }
    socket.data.chat = chat;
    next();
  } catch (error: any) {
    next(error);
  }
};
