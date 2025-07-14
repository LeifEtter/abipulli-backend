import { roles, SelectRole } from "src/db";
import { getDb } from "src/db/db";
import { eq } from "drizzle-orm";

export const getRole = async (
  power: number
): Promise<SelectRole | undefined> => {
  return await getDb().query.roles.findFirst({
    where: eq(roles.role_power, power),
  });
};
