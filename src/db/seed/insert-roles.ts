import db from "../db";
import { role, type InsertRole } from "../schema";

async function insertRoles(): Promise<object[]> {
  await db.delete(role);

  const roles: InsertRole[] = [
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

  const insertedRoles = await db.insert(role).values(roles).returning();
  return insertedRoles;
}

export default insertRoles;
