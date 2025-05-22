import { SelectUser, users } from "db";
import db from "db/db";
import { eq } from "drizzle-orm";

export const getUserWithPasswordByEmail = async (
  email: string
): Promise<SelectUser | undefined> =>
  await db.query.users.findFirst({
    where: eq(users.email, email),
    with: { role: true },
  });

export const getUserById = async (
  id: number
): Promise<SelectUser | undefined> =>
  await db.query.users.findFirst({
    where: eq(users.id, id),
    with: { role: true },
  });

// TODO: Implement Service for Calculating Storage Usage
export const getUserCost = async (userId: number): Promise<number> => {
  const imagesGeneratedByUser: { creation_cost: number | null }[] =
    await db.query.images.findMany({
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
