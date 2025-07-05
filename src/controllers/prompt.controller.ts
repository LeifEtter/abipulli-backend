import { Prompt, PromptCreateParams, PromptsResponse } from "abipulli-types";
import { Request, Response, NextFunction } from "express";
import { InsertPrompt } from "src/db";
import { ApiError } from "src/error/ApiError";
import {
  fetchPromptsForUser,
  insertPrompt,
} from "src/services/prompts/getPrompts.service";

export const getAllPromptsByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.user_id;
    const userPrompts: Prompt[] = await fetchPromptsForUser(userId);
    if (!userPrompts) return next(ApiError.notFound({ resource: "Prompts" }));
    const promptsResponse: PromptsResponse = {
      success: true,
      data: {
        total: userPrompts.length,
        page: 1,
        pageSize: userPrompts.length,
        items: userPrompts,
      },
    };
    res.status(200).send(promptsResponse);
  } catch (error) {
    next(error);
  }
};

export const insertPromptController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const promptParams = req.body as PromptCreateParams;
    const userId = res.locals.user.user_id;
    const prompt: InsertPrompt = {
      user_id: userId,
      title: promptParams.title ?? "",
      purpose: promptParams.purpose,
      content: promptParams.content,
      description: "Placeholder Description",
    };
    const insertedPromptId = await insertPrompt(prompt);
    res.status(201).send({ promptId: insertedPromptId });
  } catch (error) {
    next(error);
  }
};
