import { eq } from "drizzle-orm";
import { designs } from "src/db";
import { getDb } from "src/db/db";

export const deleteDesignById = async (designId: number): Promise<void> => {
  await getDb().delete(designs).where(eq(designs.id, designId));
};
