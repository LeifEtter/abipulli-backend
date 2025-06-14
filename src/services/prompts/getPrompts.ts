import { Prompt } from "abipulli-types/dist/types/models/prompt";
import { eq } from "drizzle-orm";
import { InsertPrompt, prompts, SelectPrompt } from "src/db";
import db from "src/db/db";
import { castPrompt } from "./castPrompt";

export const fetchPromptsForUser = async (
  userId: number
): Promise<Prompt[]> => {
  const dbPrompts: SelectPrompt[] | undefined = await db.query.prompts.findMany(
    { where: eq(prompts.user_id, userId) }
  );
  return dbPrompts.map((prompt) => castPrompt(prompt));
};

