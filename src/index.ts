import "dotenv/config.js";
import { logger } from "./lib/logger.js";
import app from "./app.js";

const abortMessage: string = "--- Aborting Initialization Process ---";
const isNumbersOnly = (str: string): boolean => /^\d+$/.test(str);

async function main() {
  try {
    logger.info("### Abipulli.com Backend Initializing ###");
    const jwtSecret: string | undefined = process.env.JWT_SECRET;
    const port: string | undefined = process.env.PORT;

    if (jwtSecret == undefined) {
      logger.error("Please set JWT_SECRET=[randomString] in the .env file.");
      logger.warn(abortMessage);
      return;
    }
    if (port == undefined || !isNumbersOnly(port)) {
      logger.error(
        "Invalid Port in .env. Please set a PORT=[port to be used] in the .env file."
      );
      logger.warn(abortMessage);
      return;
    }
    app.listen(parseInt(port), () => {
      logger.info(`### Listening to Port ${port} ###`);
    });
  } catch (error) {
    logger.error(error);
  }
}

main();
