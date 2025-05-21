import bcrypt from "bcrypt";

export const passwordIsValid = async (
  pass1: string,
  pass2: string
): Promise<boolean> => await bcrypt.compare(pass1, pass2);
