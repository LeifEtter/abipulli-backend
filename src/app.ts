import express from "express";
import { pinoHttp } from "pino-http";
import logger from "./logging/logger";

const app = express();

app.use(
  pinoHttp({
    logger,
  })
);

app.route("/test").get((req: express.Request, res: express.Response): void => {
  res.status(200).send({ message: "Working" });
});

export default app;
