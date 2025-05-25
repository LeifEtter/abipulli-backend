import { UserRole } from "abipulli-types";
import { InsertRole, SelectRole } from "src/db";

export const castRole = (role: SelectRole): UserRole => {
  return {
    id: role.id,
    roleName: role.role_name,
    rolePower: role.role_power,
  };
};

export const castRoleToDb = (role: UserRole): InsertRole => {
  return {
    role_name: role.roleName,
    role_power: role.rolePower,
  };
};
