import { eq } from "drizzle-orm";
import { InsertPrompt, prompts, SelectPrompt } from "src/db";
import { getDb } from "src/db/db";
import { castPrompt } from "./castPrompt";
import { Prompt } from "abipulli-types";

export const fetchPromptsForUser = async (
  userId: number
): Promise<Prompt[]> => {
  const dbPrompts: SelectPrompt[] | undefined =
    await getDb().query.prompts.findMany({
      where: eq(prompts.user_id, userId),
    });
  return dbPrompts.map((prompt) => castPrompt(prompt));
};

export const insertPrompt = async (
  prompt: InsertPrompt
): Promise<number | undefined> => {
  const insertedPrompts: { id: number }[] | undefined = await getDb()
    .insert(prompts)
    .values(prompt)
    .returning({ id: prompts.id });
  if (!insertedPrompts[0]) return undefined;
  return insertedPrompts[0].id;
};
