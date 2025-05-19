import type { Request, Response } from "express";
import path from "path";
import { pino } from "pino";
import { pinoHttp } from "pino-http";
import { fileURLToPath } from "url";

export const logger = pino({
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
          destination: `${path.dirname(
            fileURLToPath(import.meta.url)
          )}/app.log`,
        },
      },
    ],
  },
});

export const httpLogger = pinoHttp({
  logger,
  serializers: {
    req(req: Request) {
      return {
        method: req.method,
        url: req.url,
        cookiePassed: req.headers.cookie ? true : false,
      };
    },
    res(res: Response) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});
