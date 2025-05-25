import { logger } from "../../lib/logger";
import insertPullovers from "./insert-pullovers";
import insertRoles from "./insert-roles";

async function main() {
  logger.info("### STARTING SEED PROCESS ###");
  const insertedRoles = await insertRoles();
  logger.info(`+++ Inserted Roles Following Roles +++`);
  logger.info(insertedRoles);
  logger.info("+++++++++++++++++++++++++++++++++++++++");
  const insertedPullovers = await insertPullovers();
  logger.info(`+++ Inserted Pullovers Following Pullovers +++`);
  logger.info(insertedPullovers);
  logger.info("+++++++++++++++++++++++++++++++++++++++");
  logger.info("### FINISHED SEEDING ###");
}

main();
