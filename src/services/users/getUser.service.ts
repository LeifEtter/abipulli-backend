import { images, SelectUser, users } from "src/db";
import { getDb } from "src/db/db";
import { and, eq } from "drizzle-orm";
import { castUser } from "./castUser.service";
import { User } from "abipulli-types";
import { omitKey } from "src/lib/misc/omitKey";

export const getUserWithPasswordByEmail = async (
  email: string
): Promise<SelectUser | undefined> =>
  await getDb().query.users.findFirst({
    where: eq(users.email, email),
    with: { role: true },
  });

export const getUserWithPasswordById = async (
  id: number
): Promise<SelectUser | undefined> =>
  await getDb().query.users.findFirst({
    where: eq(users.id, id),
    with: { role: true },
  });

export const getUserById = async (
  id: number
): Promise<Omit<User, "password"> | undefined> => {
  const dbUser = await getDb().query.users.findFirst({
    where: eq(users.id, id),
    columns: { password: false },
    with: { role: true },
  });

  if (!dbUser) {
    return undefined;
  }
  const user = castUser(omitKey(dbUser, "password"));
  return user;
};

export const getAllUsers = async (): Promise<User[]> => {
  const dbUsers: SelectUser[] = await getDb().query.users.findMany({
    with: { role: true },
  });
  const users: User[] = [];
  for (let dbUser of dbUsers) {
    const user: User = castUser(omitKey(dbUser, "password"));
    const userCost: number = await getUserCost(dbUser.id);
    user.totalCost = userCost;
    users.push(user);
  }
  return users;
};

// TODO: Implement Service for Calculating Storage Usage
export const getUserCost = async (userId: number): Promise<number> => {
  const imagesGeneratedByUser: { creation_cost: number | null }[] =
    await getDb().query.images.findMany({
      where: and(eq(images.user_id, userId), eq(images.generated, true)),
      columns: {
        creation_cost: true,
      },
    });
  const totalTotalCost: number = imagesGeneratedByUser.reduce(
    (prev, e) => prev + (e.creation_cost ?? 0),
    0
  );
  return totalTotalCost;
};

// TODO: Implement Service for Calculating Total Cost of User Generated Content
