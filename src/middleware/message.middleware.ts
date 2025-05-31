import { Chat } from "abipulli-types";
import { Socket } from "socket.io";
import { InsertMessage } from "src/db";
import { ApiError } from "src/error/ApiError";
import { createMessage } from "src/services/chats/createMessage";
import { z } from "zod";

export const handleMessage = async (socket: Socket) => {
  socket.on("send_message", async (msg: string) => {
    try {
      const chat: Chat = socket.data.chat;
      const userData: TokenContent = socket.data.user;
      {}
      const message: InsertMessage = {
        content: msg,
        sender_id: userData.user_id,
        chat_id: chat.id,
      };
      const savedMessage: InsertMessage = await createMessage(message);
      socket.to(chat.id.toString()).emit("receive_message", savedMessage);
    } catch (error) {
      const messageError = new ApiError({
        code: 500,
        info: "Something went wrong while trying to save your message.",
        resource: "Message",
      });
      socket.emit("message_error", messageError);
    }
  });
};

// io.emit("receive_message", msg);
