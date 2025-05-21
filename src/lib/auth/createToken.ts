import jwt from "jsonwebtoken";

export const createToken = (userId: number, rolePower: number): string =>
  jwt.sign(
    {
      user_id: userId,
      role_power: rolePower,
    },
    process.env.JWT_SECRET!
  );

export const createAnonymousToken = (ipAddress: string): string =>
  jwt.sign({ ip_address: ipAddress }, process.env.JWT_SECRET!);
