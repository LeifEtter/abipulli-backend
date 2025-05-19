import { logger } from "../../lib/logger";
import insertRoles from "./insert-roles";

async function main() {
  logger.info("### STARTING SEED PROCESS ###");
  const insertedRoles = await insertRoles();
  logger.info(`+++ Inserted Roles Following Roles +++`);
  logger.info(insertedRoles);
  logger.info("+++++++++++++++++++++++++++++++++++++++");
  logger.info("### FINISHED SEEDING ###");
}

main();
