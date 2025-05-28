import { ChatResponse, ChatSchema } from "abipulli-types";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "src/error/ApiError";
import { createChat } from "src/services/chats/createChat.service";

export const createChatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = res.locals.params.orderId!;
    const userId = res.locals.user.user_id!;
    const createdChat = await createChat({
      orderId,
      userId,
      assignedAdminId: undefined,
    });
    const chatResponse: ChatResponse = { success: true, data: createdChat };
    res.status(201).send(chatResponse);
  } catch (error) {
    next(ApiError.internal({ errorInfo: null }));
  }
};
