import { eq } from "drizzle-orm";
import { designs } from "src/db";
import { getDb } from "src/db/db";

interface UpdateDesignPulloverParams {
  designId: number;
  pulloverId: number;
}

export const updateDesignPullover = async ({
  designId,
  pulloverId,
}: UpdateDesignPulloverParams) => {
  await getDb()
    .update(designs)
    .set({ preferred_pullover_id: pulloverId })
    .where(eq(designs.id, designId));
};
