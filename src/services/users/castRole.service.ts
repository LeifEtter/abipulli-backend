import { UserRole } from "abipulli-types";
import { SelectRole } from "src/db";

export const castRole = (role: SelectRole): UserRole => {
  return {
    id: role.id,
    roleName: role.role_name,
    rolePower: role.role_power,
  };
};
