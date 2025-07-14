import { sql } from "drizzle-orm";
import { designs, pullovers, users } from "src/db";
import { getDb } from "src/db/db";

export interface DesignFactory {
  insertSingleDesign: (orderId: number, userId: number) => Promise<number>;
}

const randomPulloverId = async (): Promise<number> => {
  const pulloverId = await getDb()
    .select({ id: pullovers.id })
    .from(pullovers)
    .orderBy(sql`random()`)
    .limit(1);
  return pulloverId[0]!.id!;
};

export const insertSingleDesign = async (
  orderId: number,
  userId: number
): Promise<number> => {
  const design = await getDb()
    .insert(designs)
    .values({
      order_id: orderId,
      customer_id: userId,
      design_cost: 0,
      preferred_pullover_id: await randomPulloverId(),
    })
    .returning({ id: designs.id });
  const designId = design[0]!.id!;
  return designId;
};

export const designFactory: DesignFactory = {
  insertSingleDesign,
};
