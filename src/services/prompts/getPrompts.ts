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

export const insertPrompt = async (
  prompt: InsertPrompt
): Promise<number | undefined> => {
  const insertedPrompts: { id: number }[] | undefined = await db
    .insert(prompts)
    .values(prompt)
    .returning({ id: prompts.id });
  if (!insertedPrompts[0]) return undefined;
  return insertedPrompts[0].id;
};
