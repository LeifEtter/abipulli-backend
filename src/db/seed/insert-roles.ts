import db from "../db";
import { roles, type InsertRole } from "../index";

async function insertRoles(): Promise<object[]> {
  const currentRoles = await db.select().from(roles);
  if (currentRoles.length > 0) {
    return currentRoles;
  }

  await db.delete(roles);

  const newRoles: InsertRole[] = [
    {
      role_name: "anonymous",
      role_power: 0,
    },
    {
      role_name: "registered",
      role_power: 1,
    },
    {
      role_name: "admin",
      role_power: 10,
    },
  ];

  const insertedRoles = await db.insert(roles).values(newRoles).returning();
  return insertedRoles;
}

export default insertRoles;
