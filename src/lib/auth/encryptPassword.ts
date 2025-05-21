import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../../constants";

export const encryptPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, SALT_ROUNDS);
