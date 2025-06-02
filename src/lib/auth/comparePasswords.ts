import bcrypt from "bcrypt";

interface PasswordIsValidParams {
  plainPassword: string;
  encryptedPassword: string;
}

export const passwordIsValid = async ({
  plainPassword,
  encryptedPassword,
}: PasswordIsValidParams): Promise<boolean> =>
  await bcrypt.compare(plainPassword, encryptedPassword);
