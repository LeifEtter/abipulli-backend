import { Prompt } from "abipulli-types/dist/types/models/prompt";
import { SelectPrompt } from "src/db";

export const castPrompt = (prompt: SelectPrompt): Prompt => {
  return {
    id: prompt.id,
    createdAt: prompt.created_at,
    title: prompt.title,
    description: prompt.description,
    updatedAt: prompt.updated_at,
    userId: prompt.user_id,
    purpose: prompt.purpose ?? "",
    content: prompt.content,
  };
};
