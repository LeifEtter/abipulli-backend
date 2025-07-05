import { Pullover } from "abipulli-types";
import { getDb } from "src/db/db";
import { castPullover } from "./castPullover.service";
import { SelectPulloverWithImage } from "src/db";

export const fetchAllPullovers = async (): Promise<Pullover[]> => {
  const dbPullovers: SelectPulloverWithImage[] =
    await getDb().query.pullovers.findMany({
      with: { image: true },
    });
  const castedPullovers: Pullover[] = dbPullovers.map((pullover) =>
    castPullover(pullover)
  );
  return castedPullovers;
};
