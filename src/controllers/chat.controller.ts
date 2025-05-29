import {
  Chat,
  ChatCreate,
  ChatResponse,
  errorMessages,
  Order,
} from "abipulli-types";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "src/error/ApiError";
import { createChat } from "src/services/chats/createChat.service";
import { getChatWithMessagesFromDb } from "src/services/chats/getChat.service";
import { getOrderById } from "src/services/orders/getOrderById.service";

export const createChatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.user_id!;
    const orderId: number | undefined = res.locals.params.orderId!;
    const order: Order | undefined = await getOrderById(orderId);
    const { assignedAdminId, initialMessage } = req.body as ChatCreate;
    //TODO: Do these things in middleware combined with the requiredParams
    if (!order) {
      return next(
        new ApiError({
          code: 404,
          info: errorMessages.resourceNotFound,
          resource: "Chat",
        })
      );
    }
    if (order.customerId != userId) {
      return next(
        new ApiError({
          code: 401,
          info: errorMessages.resourceNotOwned,
          resource: "Chat",
        })
      );
    }
    const createdChat = await createChat({
      order_id: orderId,
      user_id: userId,
      assigned_admin_id: undefined,
    });
    const chatResponse: ChatResponse = { success: true, data: createdChat };
    res.status(201).send(chatResponse);
  } catch (error) {
    next(error);
  }
};

export const getChatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatId: number = res.locals.params.chatId!;
    const userId: number = res.locals.user.user_id;
    const chat: Chat | undefined = await getChatWithMessagesFromDb(chatId);

    if (!chat) {
      return next(
        new ApiError({
          code: 404,
          info: errorMessages.resourceNotFound,
          resource: "Chat",
        })
      );
    }
    if (chat.userId != userId) {
      return next(
        new ApiError({
          code: 401,
          info: errorMessages.resourceNotOwned,
          resource: "Chat",
        })
      );
    }
    const chatResponse: ChatResponse = {
      data: chat,
      success: true,
    };
    res.status(200).send(chatResponse);
  } catch (error) {
    next(error);
  }
};
