import { roles, SelectRole } from "src/db";
import db from "src/db/db";
import { eq } from "drizzle-orm";

export const getRole = async (
  power: number
): Promise<SelectRole | undefined> => {
  return await db.query.roles.findFirst({ where: eq(roles.role_power, power) });
};
