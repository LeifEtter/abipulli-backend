import path from "path";
import { destination, pino } from "pino";
import { fileURLToPath } from "url";

const logger = pino({
  level: "info",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: { colorize: true },
      },
      {
        target: "pino/file",
        options: {
          destination: `${path.dirname(fileURLToPath(import.meta.url))}/app.log
        `,
        },
      },
    ],
  },
});

export default logger;
