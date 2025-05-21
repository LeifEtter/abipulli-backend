import { roles, SelectRole } from "db";
import db from "db/db";
import { eq } from "drizzle-orm";

export const getRole = async (
  power: number
): Promise<SelectRole | undefined> => {
  return await db.query.roles.findFirst({ where: eq(roles.role_power, power) });
};
