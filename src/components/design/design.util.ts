import db from "db/db";
import { designs, SelectDesign, users } from "db/index";
import { eq } from "drizzle-orm";

export const getDesignById = async (
  designId: number
): Promise<SelectDesign | undefined> =>
  await db.query.designs.findFirst({
    where: eq(designs.id, designId),
  });
