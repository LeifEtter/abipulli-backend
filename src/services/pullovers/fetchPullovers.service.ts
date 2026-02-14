import { Pullover } from "abipulli-types";
import { getDb } from "src/db/db";
import { castPullover } from "./castPullover.service";
import { pullovers, SelectPullover, SelectPulloverWithImage } from "src/db";
import { eq } from "drizzle-orm";
import { ApiError } from "src/error/ApiError";

export const fetchAllPullovers = async (): Promise<Pullover[]> => {
  const dbPullovers: SelectPulloverWithImage[] =
    await getDb().query.pullovers.findMany({
      with: { frontImage: true, backImage: true },
    });
  const castedPullovers: Pullover[] = dbPullovers.map((pullover) =>
    castPullover(pullover),
  );
  return castedPullovers;
};

export const fetchPulloverById = async (
  pulloverId: number,
): Promise<Pullover> => {
  const dbPullover: SelectPulloverWithImage | undefined =
    await getDb().query.pullovers.findFirst({
      where: eq(pullovers.id, pulloverId),
      with: { frontImage: true, backImage: true },
    });
  if (!dbPullover) throw ApiError.notFound({ resource: "Image To Design" });
  const castedPullover: Pullover = castPullover(dbPullover);
  return castedPullover;
};
